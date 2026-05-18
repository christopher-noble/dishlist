import type { User } from '../../entities/user.js';

export type SignUpUserInput = {
  firstName: string;
  lastName: string;
  primaryEmail: string;
  secondaryEmail?: string | null;
};

export type CreateWaitlistUserInput = {
  firstName: string;
  lastName: string;
  primaryEmail: string;
};

export interface CreateUserProviderPort {
  signUpUser(input: SignUpUserInput): Promise<User>;
  createWaitlistUser(input: CreateWaitlistUserInput): Promise<User>;
}
