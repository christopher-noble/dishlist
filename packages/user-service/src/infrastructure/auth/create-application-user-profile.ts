import {
  type AuthUserRecord,
  resolveUserProfileForAuthUser,
} from './resolve-user-profile.js';

export type { AuthUserRecord };

/**
 * Sidecar: ensure a domain `users` row exists and is linked to Better Auth's `auth_user`.
 */
export async function createApplicationUserProfile(
  authUser: AuthUserRecord,
): Promise<void> {
  await resolveUserProfileForAuthUser(authUser);
}
