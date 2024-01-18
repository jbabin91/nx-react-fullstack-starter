import { initTRPC } from '@trpc/server';

import type { Context } from './context';

export const t = initTRPC.context<Context>().create();

export const router = t.router;
/**
 * Unprotected procedure
 */
export const publicProcedure = t.procedure;

/**
 * Protected procedure
 */
export const protectedProcedure = t.procedure.use(function isAuthed(opts) {
  // if (!opts.ctx.session?.user?.email) {
  //   throw new TRPCError({
  //     code: 'UNAUTHORIZED',
  //   });
  // }
  return opts.next();
});
