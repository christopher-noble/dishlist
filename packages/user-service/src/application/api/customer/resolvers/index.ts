import { loginResolver } from './log-in.js';
import { logoutResolver } from './log-out.js';
import { signUpResolver } from './sign-up.js';
import { joinWaitlistResolver } from './join-waitlist.js';

export const resolvers = {
  Query: {
    hello: () => 'Test',
  },
  Mutation: {
    signUp: signUpResolver.signUp,
    joinWaitlist: joinWaitlistResolver.joinWaitlist,
    login: loginResolver.login,
    logout: logoutResolver.logout,
  }
};

