import 'reflect-metadata';

import type { User, UserAccountStatus } from '../../entities/user.js';
import type { UserRepositoryPort } from '../../repositories/user-repository.port.js';
import { injectable, inject } from 'tsyringe'
import {
    CreateUserProviderPort,
    type SignUpUserInput,
    type CreateWaitlistUserInput,
} from './create-user.port.js';
import { RepositoryTokens } from '../../../configuration/dependency-registry/tokens/repository-tokens.js';

@injectable()
export class CreateUserProviderAdapter implements CreateUserProviderPort {
    constructor(
        @inject(RepositoryTokens.UserRepository)
        private userRepository: UserRepositoryPort,
    ) { }

    public async signUpUser(input: SignUpUserInput): Promise<User> {
        const now = new Date();

        return this.userRepository.create({
            firstName: input.firstName,
            lastName: input.lastName,
            primaryEmail: input.primaryEmail,
            secondaryEmail: input.secondaryEmail ?? null,
            accountStatus: 'ACTIVE' as UserAccountStatus,
            createdAt: now,
            updatedAt: now,
        });
    }

    public async createWaitlistUser(input: CreateWaitlistUserInput): Promise<User> {
        const now = new Date();

        return this.userRepository.create({
            firstName: input.firstName,
            lastName: input.lastName,
            primaryEmail: input.primaryEmail,
            secondaryEmail: null,
            accountStatus: 'QUEUED' as UserAccountStatus,
            createdAt: now,
            updatedAt: now,
        });
    }
}
