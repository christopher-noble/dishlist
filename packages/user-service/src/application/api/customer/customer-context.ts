export type CustomerContext = {
  request: Request;
  requestId?: string;
  userId?: string;
};

export function createContext({ request }: { request: Request }): CustomerContext {
  const requestId = request.headers.get('x-request-id') ?? undefined;
  const userId = request.headers.get('x-user-id') ?? undefined;

  return { request, requestId, userId };
}

