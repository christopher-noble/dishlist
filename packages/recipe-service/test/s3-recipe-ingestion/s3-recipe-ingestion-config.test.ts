import { describe, expect, it } from 'vitest';

import {
  buildS3Uri,
  getShardObjectKey,
  joinObjectKey,
  parseS3BucketArn,
} from '../../jobs/helpers/s3-recipe-ingestion.js';

describe('s3 recipe ingestion config helpers', () => {
  it('parses S3 bucket ARNs', () => {
    expect(parseS3BucketArn('arn:aws:s3:::dishlist-ml-staging')).toEqual({
      bucketName: 'dishlist-ml-staging',
      embeddedPrefix: '',
    });

    expect(parseS3BucketArn('arn:aws:s3:::dishlist-ml-staging/base/prefix')).toEqual({
      bucketName: 'dishlist-ml-staging',
      embeddedPrefix: 'base/prefix',
    });
  });

  it('builds shard keys and URIs', () => {
    const key = getShardObjectKey('20260101T000000Z', 7);

    expect(key.endsWith('recipes-00007.jsonl')).toBe(true);
    expect(buildS3Uri('dishlist-ml-staging', key)).toBe(
      `s3://dishlist-ml-staging/${joinObjectKey('ml/recipe-ingestion', '20260101T000000Z', 'recipes-00007.jsonl')}`,
    );
  });
});
