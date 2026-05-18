
import { container } from 'tsyringe';
import { ProviderTokens } from '../../../../configuration/dependency-registry/tokens/provider-tokens.js';
import type { CreateUserProviderPort } from '../../../../domain/providers/create-user/create-user.port.js';
import { CustomerContext } from '../customer-context.js';

export interface JoinWaitlistArgs {
  input: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export const joinWaitlistResolver = {
  async joinWaitlist(
    _: unknown,
    args: JoinWaitlistArgs,
    _context: CustomerContext,
  ) {
    const provider = container.resolve<CreateUserProviderPort>(
      ProviderTokens.CreateUserProvider,
    );

    return provider.createWaitlistUser({
      firstName: args.input.firstName,
      lastName: args.input.lastName,
      primaryEmail: args.input.email,
    });
  },
};