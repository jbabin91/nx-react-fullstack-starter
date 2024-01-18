import { createUserSchema, loginUserSchema } from '@repo/db';

import {
  loginHandler,
  logoutHandler,
  refreshAccessTokenHandler,
  registerHandler,
} from '../../controllers/auth.controller';
import { getMeHandler } from '../../controllers/user.controller';
import { publicProcedure, router } from '../../trpc';

export const authRouter = router({
  getMe: publicProcedure.query(({ ctx }) => getMeHandler({ ctx })),
  login: publicProcedure
    .input(loginUserSchema)
    .mutation(async ({ input, ctx }) => await loginHandler({ ctx, input })),
  logout: publicProcedure.mutation(({ ctx }) => logoutHandler({ ctx })),
  refreshToken: publicProcedure.query(({ ctx }) =>
    refreshAccessTokenHandler({ ctx }),
  ),
  register: publicProcedure
    .input(createUserSchema)
    .mutation(async ({ input }) => await registerHandler({ input })),
});
