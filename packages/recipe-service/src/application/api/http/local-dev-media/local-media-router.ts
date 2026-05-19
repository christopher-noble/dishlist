import type { IncomingMessage, ServerResponse } from 'node:http';

import { handleLocalUpload } from './handlers/local-upload-handler.ts';
import { handleServeLocalUpload } from './handlers/serve-local-uploads-handler.ts';

/**
 * Dev-only media routes. Registered only when STORAGE_STRATEGY=local.
 * Production (s3) never mounts these handlers — uploads/downloads bypass Node entirely.
 */
export async function routeLocalDevMediaRequest(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<boolean> {
  if (await handleLocalUpload(req, res)) {
    return true;
  }

  if (await handleServeLocalUpload(req, res)) {
    return true;
  }

  return false;
}
