import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';

export async function createContext({
  req,
  res,
}: CreateExpressContextOptions): Promise<
  Omit<CreateExpressContextOptions, 'info'>
> {
  return {
    req,
    res,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
