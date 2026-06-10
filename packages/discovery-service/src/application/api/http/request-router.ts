import type { IncomingMessage, ServerResponse } from 'node:http';

export async function routeHttpRequest(
  req: IncomingMessage,
  res: ServerResponse,
  next: () => Promise<void>,
): Promise<void> {
  await next();
}
