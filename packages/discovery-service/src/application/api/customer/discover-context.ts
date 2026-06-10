import { authenticateRequest } from '../http/authenticate-request.js';
import type { AuthenticatedUser } from '../../../domain/auth/authenticated-user.js';

export interface DiscoverContext {
  request: Request;
  requestId?: string;
  authenticatedUser: AuthenticatedUser | null;
}

export interface CreateContextInput {
  request: Request;
}

export async function createContext(
  input: CreateContextInput,
): Promise<DiscoverContext> {
  const requestId = input.request.headers.get('x-request-id') ?? undefined;
  const authenticatedUser = await authenticateRequest(input.request);

  return {
    request: input.request,
    requestId,
    authenticatedUser,
  };
}
