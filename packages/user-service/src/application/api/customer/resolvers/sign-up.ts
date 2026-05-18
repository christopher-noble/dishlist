import { container } from 'tsyringe';

import { ProviderTokens } from '../../../../configuration/dependency-registry/tokens/provider-tokens.js';
import type { CreateUserProviderPort } from '../../../../domain/providers/create-user/create-user.port.js';
import { CustomerContext } from '../customer-context.js';

export interface SignUpArgs {
  input: {
    firstName: string;
    lastName: string;
    primaryEmail: string;
    secondaryEmail?: string | null;
  };
}

export const signUpResolver = {
  async signUp(
    _: unknown,
    args: SignUpArgs,
    _context: CustomerContext,
  ) {
    const createUserProvider = container.resolve<CreateUserProviderPort>(
      ProviderTokens.CreateUserProvider,
    );

    return createUserProvider.signUpUser(args.input);
  },
};