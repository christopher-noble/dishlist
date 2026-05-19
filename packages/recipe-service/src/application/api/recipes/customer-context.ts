import { authenticateRequest } from '../http/authenticate-request.ts';
import type { AuthenticatedUser } from '../../../domain/auth/authenticated-user.ts';

export interface CustomerContext {
  request: Request;
  requestId?: string;
  authenticatedUser: AuthenticatedUser | null;
}

export interface CreateContextInput {
  request: Request;
}

export async function createContext(
  input: CreateContextInput,
): Promise<CustomerContext> {
  const requestId = input.request.headers.get('x-request-id') ?? undefined;
  const authenticatedUser = await authenticateRequest(input.request);

  return {
    request: input.request,
    requestId,
    authenticatedUser,
  };
}
