import { v7 as uuidv7 } from 'uuid';

import { prisma } from '../../configuration/database/index.js';

export type AuthUserRecord = {
  id: string;
  name: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
};

function resolveProfileNames(authUser: AuthUserRecord): {
  firstName: string;
  lastName: string;
} {
  const firstName =
    authUser.firstName?.trim() ||
    authUser.name.trim().split(/\s+/)[0] ||
    'User';
  const lastName =
    authUser.lastName?.trim() ||
    authUser.name.trim().split(/\s+/).slice(1).join(' ') ||
    '';

  return { firstName, lastName };
}

/**
 * Returns the domain `users` row for an auth session user, linking by email when needed.
 */
export async function resolveUserProfileForAuthUser(authUser: AuthUserRecord) {
  const byAuthId = await prisma.user.findUnique({
    where: { authUserId: authUser.id },
  });

  if (byAuthId) {
    return byAuthId;
  }

  const byEmail = await prisma.user.findUnique({
    where: { primaryEmail: authUser.email },
  });

  if (byEmail) {
    if (byEmail.authUserId && byEmail.authUserId !== authUser.id) {
      return null;
    }

    return prisma.user.update({
      where: { id: byEmail.id },
      data: { authUserId: authUser.id },
    });
  }

  const { firstName, lastName } = resolveProfileNames(authUser);
  const now = new Date();

  return prisma.user.create({
    data: {
      id: uuidv7(),
      authUserId: authUser.id,
      firstName,
      lastName,
      primaryEmail: authUser.email,
      secondaryEmail: null,
      accountStatus: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
    },
  });
}
