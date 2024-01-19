import { TRPCError } from '@trpc/server';

import type { Context } from '../trpc/context';

function getMeHandler({ ctx }: { ctx: Context }) {
  try {
    const user = ctx.user;
    return {
      status: 'success',
      user,
    };
  } catch (error: any) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message,
    });
  }
}

export { getMeHandler };
