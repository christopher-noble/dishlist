import type { IncomingMessage, ServerResponse } from 'node:http';

import { isLocalMediaStrategy } from '../../../infrastructure/media/asset-storage.ts';
import { routeLocalDevMediaRequest } from './local-dev-media/local-media-router.ts';

const localDevMediaEnabled = isLocalMediaStrategy();

export async function routeHttpRequest(
  req: IncomingMessage,
  res: ServerResponse,
  next: () => Promise<void>,
): Promise<void> {
  if (localDevMediaEnabled && (await routeLocalDevMediaRequest(req, res))) {
    return;
  }

  await next();
}
