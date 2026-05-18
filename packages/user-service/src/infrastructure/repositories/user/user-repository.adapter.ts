import { v7 as uuidv7 } from 'uuid';
import { User, UserAccountStatus } from '../../../domain/entities/user.js';
import type { UserRepositoryPort } from '../../../domain/repositories/user-repository.port.js';
import { prisma } from '../../../configuration/database/index.js';
import { injectable } from 'tsyringe';
import type { User as SchemaUser } from '@prisma/client';
import { enumFromKeyStringOrThrow } from '../../../lib/enum-utils.js';

@injectable()
export class UserRepositoryAdapter implements UserRepositoryPort {
  async create(user: Omit<User, 'id'>): Promise<User> {
    const created = await prisma.user.create({
      data: {
        id: uuidv7(),
        firstName: user.firstName,
        lastName: user.lastName,
        primaryEmail: user.primaryEmail,
        secondaryEmail: user.secondaryEmail,
        accountStatus: user.accountStatus,
      },
    });

    return this.mapSchemaUserToDomain(created);
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return this.mapSchemaUserToDomain(user);
  }

  async findByAuthUserId(authUserId: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { authUserId },
    });

    if (!user) {
      return null;
    }

    return this.mapSchemaUserToDomain(user);
  }

  private mapSchemaUserToDomain(user: SchemaUser): User {
    return {
      id: user.id,
      authUserId: user.authUserId,
      firstName: user.firstName,
      lastName: user.lastName,
      primaryEmail: user.primaryEmail,
      secondaryEmail: user.secondaryEmail,
      accountStatus: enumFromKeyStringOrThrow(
        UserAccountStatus,
        user.accountStatus,
      ),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
