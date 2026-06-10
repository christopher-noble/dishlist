/**
 * Reads recipes from the recipe_service Postgres database and exports
 * SageMaker-ready JSONL shards plus a manifest to local disk or S3.
 */
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { Pool } from 'pg';

import { appConfig } from '../config/config.default.js';
import {
  assertPositiveIngestionNumber,
  buildS3Uri,
  createRunId,
  getManifestObjectKey,
  getS3BucketName,
  getS3Prefix,
  getS3Region,
  getShardFileName,
  getShardObjectKey,
  joinObjectKey,
  mapToIngestedRecipeRecord,
  serializeRecords,
  type IngestedRecipeRecord,
  type RecipeDatabaseRow,
} from './helpers/s3-recipe-ingestion.ts';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ShardManifest {
  index: number;
  key: string;
  uri: string;
  recordCount: number;
}

interface IngestionManifest {
  schemaVersion: string;
  recordType: 'recipe';
  exportedAt: string;
  runId: string;
  recordCount: number;
  shardCount: number;
  shardSize: number;
  filters: { excludeDeleted: true; excludeArchived: boolean };
  shards: ShardManifest[];
  sagemaker: {
    inputMode: 'File';
    contentType: 'application/jsonlines';
    recommendedChannelName: 'training';
  };
}

interface IngestionResult {
  runId: string;
  recordCount: number;
  shardCount: number;
  manifestKey: string;
  manifestUri: string;
  outputRoot: string;
}

interface IngestionOptions {
  batchSize?: number;
  shardSize?: number;
  includeArchived?: boolean;
}

const ZERO_UUID = '00000000-0000-0000-0000-000000000000';
const EPOCH = new Date(0);

const RECIPE_QUERY = `
  SELECT
    id, user_id, name, description, category, ingredients, steps,
    serves, nutritional_info, image_key, created_at, updated_at
  FROM recipes
  WHERE deleted_at IS NULL
    AND ($1::boolean OR archived_at IS NULL)
    AND (created_at, id) > ($2::timestamptz, $3::uuid)
  ORDER BY created_at ASC, id ASC
  LIMIT $4
`;

async function* streamRecipes(
  pool: Pool,
  options: { batchSize: number; includeArchived: boolean },
): AsyncGenerator<IngestedRecipeRecord[]> {
  let cursorCreatedAt = EPOCH;
  let cursorId = ZERO_UUID;

  while (true) {
    const result = await pool.query<RecipeDatabaseRow>(RECIPE_QUERY, [
      options.includeArchived,
      cursorCreatedAt,
      cursorId,
      options.batchSize,
    ]);

    if (result.rows.length === 0) {
      return;
    }

    const lastRow = result.rows[result.rows.length - 1];
    cursorCreatedAt = lastRow.created_at;
    cursorId = lastRow.id;

    yield result.rows.map(mapToIngestedRecipeRecord);

    if (result.rows.length < options.batchSize) {
      return;
    }
  }
}

// ---------------------------------------------------------------------------
// Output destinations
// ---------------------------------------------------------------------------

interface ShardWriteResult {
  key: string;
  uri: string;
  recordCount: number;
}

interface Destination {
  beginRun(runId: string): Promise<{ outputRoot: string }>;
  writeShard(shardIndex: number, records: IngestedRecipeRecord[]): Promise<ShardWriteResult>;
  finalizeRun(manifest: IngestionManifest): Promise<IngestionResult>;
}

function createLocalDestination(): Destination {
  let runId = '';
  let outputRoot = '';

  return {
    async beginRun(nextRunId) {
      runId = nextRunId;
      outputRoot = path.resolve(appConfig.s3RecipeIngestion.localOutputDir, runId);
      await mkdir(outputRoot, { recursive: true });
      return { outputRoot };
    },

    async writeShard(shardIndex, records) {
      const key = getShardFileName(shardIndex);
      const uri = path.join(outputRoot, key);
      await writeFile(uri, serializeRecords(records), 'utf8');
      return { key, uri, recordCount: records.length };
    },

    async finalizeRun(manifest) {
      const manifestKey = '_manifest.json';
      const manifestUri = path.join(outputRoot, manifestKey);
      await writeFile(manifestUri, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

      return {
        runId,
        recordCount: manifest.recordCount,
        shardCount: manifest.shardCount,
        manifestKey,
        manifestUri,
        outputRoot,
      };
    },
  };
}

function createS3Destination(): Destination {
  let runId = '';
  const bucketName = getS3BucketName();
  const s3 = new S3Client({ region: getS3Region() });

  return {
    async beginRun(nextRunId) {
      runId = nextRunId;
      return { outputRoot: buildS3Uri(bucketName, joinObjectKey(getS3Prefix(), runId)) };
    },

    async writeShard(shardIndex, records) {
      const key = getShardObjectKey(runId, shardIndex);

      await s3.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: serializeRecords(records),
          ContentType: 'application/jsonlines',
        }),
      );

      return { key, uri: buildS3Uri(bucketName, key), recordCount: records.length };
    },

    async finalizeRun(manifest) {
      const manifestKey = getManifestObjectKey(runId);

      await s3.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: manifestKey,
          Body: `${JSON.stringify(manifest, null, 2)}\n`,
          ContentType: 'application/json',
        }),
      );

      return {
        runId,
        recordCount: manifest.recordCount,
        shardCount: manifest.shardCount,
        manifestKey,
        manifestUri: buildS3Uri(bucketName, manifestKey),
        outputRoot: buildS3Uri(bucketName, joinObjectKey(getS3Prefix(), runId)),
      };
    },
  };
}

function createDestination(): Destination {
  return appConfig.s3RecipeIngestion.destinationStrategy === 's3'
    ? createS3Destination()
    : createLocalDestination();
}

// ---------------------------------------------------------------------------
// Job
// ---------------------------------------------------------------------------

export async function runS3RecipeIngestion(options: IngestionOptions = {}): Promise<IngestionResult> {
  const batchSize = options.batchSize ?? appConfig.s3RecipeIngestion.batchSize;
  const shardSize = options.shardSize ?? appConfig.s3RecipeIngestion.shardSize;
  const includeArchived =
    options.includeArchived ?? appConfig.s3RecipeIngestion.includeArchived;

  assertPositiveIngestionNumber(batchSize, 'batch size');
  assertPositiveIngestionNumber(shardSize, 'shard size');

  const pool = new Pool({ connectionString: appConfig.dbUrl });
  const destination = createDestination();

  try {
    const startedAt = new Date();
    const runId = createRunId(startedAt);
    const { outputRoot } = await destination.beginRun(runId);

    let recordCount = 0;
    let shardIndex = 0;
    let shardBuffer: IngestedRecipeRecord[] = [];
    const shards: ShardManifest[] = [];

    for await (const batch of streamRecipes(pool, { batchSize, includeArchived })) {
      for (const record of batch) {
        shardBuffer.push(record);
        recordCount += 1;

        if (shardBuffer.length >= shardSize) {
          shardIndex += 1;
          const shard = await destination.writeShard(shardIndex, shardBuffer);
          shards.push({
            index: shardIndex,
            key: shard.key,
            uri: shard.uri,
            recordCount: shard.recordCount,
          });
          shardBuffer = [];
        }
      }
    }

    if (shardBuffer.length > 0) {
      shardIndex += 1;
      const shard = await destination.writeShard(shardIndex, shardBuffer);
      shards.push({
        index: shardIndex,
        key: shard.key,
        uri: shard.uri,
        recordCount: shard.recordCount,
      });
    }

    const manifest: IngestionManifest = {
      schemaVersion: appConfig.s3RecipeIngestion.schemaVersion,
      recordType: 'recipe',
      exportedAt: startedAt.toISOString(),
      runId,
      recordCount,
      shardCount: shards.length,
      shardSize,
      filters: { excludeDeleted: true, excludeArchived: !includeArchived },
      shards,
      sagemaker: {
        inputMode: 'File',
        contentType: 'application/jsonlines',
        recommendedChannelName: 'training',
      },
    };

    const result = await destination.finalizeRun(manifest);

    console.log(
      `[s3-recipe-ingestion] Exported ${recordCount} recipes across ${shards.length} shard(s) to ${outputRoot}`,
    );
    console.log(`[s3-recipe-ingestion] Manifest: ${result.manifestUri}`);

    return result;
  } finally {
    await pool.end();
  }
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const isMainModule =
  import.meta.url === pathToFileURL(path.resolve(process.argv[1] ?? '')).href;

if (isMainModule) {
  runS3RecipeIngestion().catch((error) => {
    console.error(
      '[s3-recipe-ingestion] Ingestion failed:',
      error instanceof Error ? error.message : String(error),
    );

    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    }

    process.exitCode = 1;
  });
}
