import { RecipeCategory, type NutritionalInfo } from '../../src/domain/entities/recipe.ts';
import type { RecipeIngredient } from '../../src/domain/entities/recipe-ingredient.ts';
import { appConfig } from '../../config/config.default.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface IngestedRecipeRecord {
  id: string;
  userId: string;
  name: string;
  description: string;
  category: RecipeCategory;
  ingredients: RecipeIngredient[];
  steps: string[];
  servesCount: number | null;
  nutritionalInfo: NutritionalInfo | null;
  imageKey: string | null;
  createdAt: string;
  updatedAt: string;
  trainingText: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface RecipeDatabaseRow {
  id: string;
  user_id: string;
  name: string;
  description: string;
  category: RecipeCategory;
  ingredients: unknown;
  steps: string[];
  serves: number | null;
  nutritional_info: unknown;
  image_key: string | null;
  created_at: Date;
  updated_at: Date;
}

export type IngestedRecipeBase = Omit<IngestedRecipeRecord, 'trainingText' | 'messages'>;

// ---------------------------------------------------------------------------
// S3 path helpers
// ---------------------------------------------------------------------------

const S3_ARN_PATTERN = /^arn:aws:s3:::(?<bucket>[^/]+)(?:\/(?<prefix>.*))?$/;

export function parseS3BucketArn(arn: string): { bucketName: string; embeddedPrefix: string } {
  const match = S3_ARN_PATTERN.exec(arn.trim());

  if (!match?.groups?.bucket) {
    throw new Error(
      `Invalid S3_RECIPE_INGESTION_S3_BUCKET_ARN "${arn}". Expected arn:aws:s3:::bucket-name`,
    );
  }

  return {
    bucketName: match.groups.bucket,
    embeddedPrefix: match.groups.prefix?.replace(/^\/+|\/+$/g, '') ?? '',
  };
}

export function joinObjectKey(...segments: string[]): string {
  return segments
    .flatMap((segment) => segment.split('/'))
    .map((segment) => segment.trim())
    .filter(Boolean)
    .join('/');
}

export function buildS3Uri(bucketName: string, key: string): string {
  return `s3://${bucketName}/${key.replace(/^\/+/, '')}`;
}

export function getS3Prefix(): string {
  const { bucketArn, prefix } = appConfig.s3RecipeIngestion.s3;
  const configuredPrefix = prefix.replace(/^\/+|\/+$/g, '');
  const embeddedPrefix = bucketArn.trim()
    ? parseS3BucketArn(bucketArn).embeddedPrefix
    : '';

  return [embeddedPrefix, configuredPrefix].filter(Boolean).join('/');
}

export function getS3BucketName(): string {
  const { bucketArn } = appConfig.s3RecipeIngestion.s3;

  if (!bucketArn.trim()) {
    throw new Error(
      'S3_RECIPE_INGESTION_S3_BUCKET_ARN is required when destination strategy is s3',
    );
  }

  return parseS3BucketArn(bucketArn).bucketName;
}

export function getS3Region(): string {
  const region = appConfig.s3RecipeIngestion.s3.region.trim();

  if (!region) {
    throw new Error('AWS_REGION is required when destination strategy is s3');
  }

  return region;
}

export function getShardObjectKey(runId: string, shardIndex: number): string {
  const shardName = `recipes-${String(shardIndex).padStart(5, '0')}.jsonl`;
  return joinObjectKey(getS3Prefix(), runId, shardName);
}

export function getManifestObjectKey(runId: string): string {
  return joinObjectKey(getS3Prefix(), runId, '_manifest.json');
}

export function getShardFileName(shardIndex: number): string {
  return `recipes-${String(shardIndex).padStart(5, '0')}.jsonl`;
}

// ---------------------------------------------------------------------------
// Serialization
// ---------------------------------------------------------------------------

export function serializeRecords(records: IngestedRecipeRecord[]): string {
  if (records.length === 0) {
    return '';
  }

  return records.map((record) => JSON.stringify(record)).join('\n') + '\n';
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export function assertPositiveIngestionNumber(value: number, label: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`S3 recipe ingestion ${label} must be a positive number`);
  }
}

// ---------------------------------------------------------------------------
// Record normalization
// ---------------------------------------------------------------------------

function normalizeIngredients(value: unknown): RecipeIngredient[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((entry) => {
    if (typeof entry !== 'object' || entry === null) {
      return [];
    }

    const candidate = entry as Partial<RecipeIngredient>;
    const item = typeof candidate.item === 'string' ? candidate.item.trim() : '';

    if (!item) {
      return [];
    }

    return [
      {
        item,
        amount: typeof candidate.amount === 'number' ? candidate.amount : 0,
        unit: typeof candidate.unit === 'string' ? candidate.unit : '',
      },
    ];
  });
}

function normalizeNutritionalInfo(value: unknown): NutritionalInfo | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }

  const candidate = value as NutritionalInfo;

  return {
    calories: candidate.calories ?? null,
    protein: candidate.protein ?? null,
    carbs: candidate.carbs ?? null,
    fat: candidate.fat ?? null,
    fiber: candidate.fiber ?? null,
  };
}

// ---------------------------------------------------------------------------
// Training text formatting
// ---------------------------------------------------------------------------

function formatIngredientLine(ingredient: RecipeIngredient): string {
  const quantity =
    ingredient.amount > 0
      ? `${ingredient.amount}${ingredient.unit ? ` ${ingredient.unit}` : ''}`.trim()
      : '';

  return quantity ? `- ${quantity} ${ingredient.item}` : `- ${ingredient.item}`;
}

function formatSteps(steps: string[]): string {
  return steps.map((step, index) => `${index + 1}. ${step}`).join('\n');
}

function formatNutrition(info: NutritionalInfo | null): string | null {
  if (!info) {
    return null;
  }

  const parts = [
    info.calories != null ? `${info.calories} kcal` : null,
    info.protein != null ? `${info.protein}g protein` : null,
    info.carbs != null ? `${info.carbs}g carbs` : null,
    info.fat != null ? `${info.fat}g fat` : null,
    info.fiber != null ? `${info.fiber}g fiber` : null,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(', ') : null;
}

export function buildTrainingText(record: IngestedRecipeBase): string {
  const sections = [
    `# ${record.name}`,
    '',
    `Category: ${record.category}`,
    record.servesCount != null ? `Serves: ${record.servesCount}` : null,
    '',
    '## Description',
    record.description.trim(),
    '',
    '## Ingredients',
    ...record.ingredients.map(formatIngredientLine),
    '',
    '## Steps',
    formatSteps(record.steps),
  ];

  const nutrition = formatNutrition(record.nutritionalInfo);

  if (nutrition) {
    sections.push('', '## Nutrition', nutrition);
  }

  return sections.filter((line) => line !== null).join('\n').trim();
}

export function buildTrainingMessages(
  record: IngestedRecipeBase,
  trainingText: string,
): IngestedRecipeRecord['messages'] {
  const promptParts = [
    `Write a complete recipe for ${record.name} (${record.category.toLowerCase()})`,
    record.servesCount != null ? `that serves ${record.servesCount}` : null,
    record.description.trim() ? `using this context: ${record.description.trim()}` : null,
  ].filter(Boolean);

  return [
    { role: 'user', content: `${promptParts.join(' ')}.` },
    { role: 'assistant', content: trainingText },
  ];
}

export function mapToIngestedRecipeRecord(row: RecipeDatabaseRow): IngestedRecipeRecord {
  const baseRecord: IngestedRecipeBase = {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    description: row.description,
    category: row.category,
    ingredients: normalizeIngredients(row.ingredients),
    steps: row.steps ?? [],
    servesCount: row.serves,
    nutritionalInfo: normalizeNutritionalInfo(row.nutritional_info),
    imageKey: row.image_key,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };

  const trainingText = buildTrainingText(baseRecord);

  return {
    ...baseRecord,
    trainingText,
    messages: buildTrainingMessages(baseRecord, trainingText),
  };
}

// ---------------------------------------------------------------------------
// Run helpers
// ---------------------------------------------------------------------------

export function createRunId(startedAt: Date): string {
  return startedAt.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}
