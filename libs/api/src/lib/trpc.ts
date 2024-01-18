import { initTRPC } from '@trpc/server';

export const t = initTRPC.create();

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
