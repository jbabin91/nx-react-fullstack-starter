import { initTRPC, TRPCError } from '@trpc/server';

import type { Context } from './context';

const t = initTRPC.context<Context>().create();

const router = t.router;
const middleware = t.middleware;
const procedure = t.procedure;

/**
 * Unprotected procedure
 */
const publicProcedure = procedure;

/**
 * Protected procedure
 */
const isAuthorized = middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    });
  }

  return next();
});
const isAuthorizedProcedure = procedure.use(isAuthorized);

export { isAuthorizedProcedure, publicProcedure, router };
