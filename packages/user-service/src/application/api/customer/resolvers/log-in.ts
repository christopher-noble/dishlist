export interface LoginInput {
  email: string;
  password: string;
};

export interface AuthPayload {
  token: string;
};

export const loginResolver = {
  async login(_: unknown, args: { input: LoginInput }): Promise<AuthPayload> {
    // TODO: Replace with real auth + user lookup
    const { email } = args.input;

    return { token: `token-for:${email}` };
  },
};

