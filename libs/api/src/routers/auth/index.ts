import { z } from 'zod';

import { protectedProcedure, publicProcedure, router } from '../../lib/trpc';
import { loginUser, refreshToken, registerUser, revokeTokens } from './auth.db';

export const authRouter = router({
  login: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input }) => await loginUser({ data: input })),
  refresh: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => await refreshToken({ refreshToken: input })),
  revoke: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => await revokeTokens({ userId: input })),
  signup: publicProcedure
    .input(
      z.object({
        email: z.string(),
        name: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input }) => await registerUser({ data: input })),
});
