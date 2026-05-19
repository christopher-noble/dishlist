export type AccessTokenClaims = {
  /** Domain `users.id` — used by resource APIs (e.g. recipe-service). */
  sub: string;
  authUserId: string;
};

export type IssuedAccessToken = {
  accessToken: string;
  expiresAt: string;
};
