export interface CustomerContext {
  request: Request;
  requestId?: string;
  userId?: string;
}

export interface CreateContextInput {
  request: Request;
}

export function createContext(input: CreateContextInput): CustomerContext {
  const requestId = input.request.headers.get('x-request-id') ?? undefined;
  const userId = input.request.headers.get('x-user-id') ?? undefined;

  return { request: input.request, requestId, userId };
}
