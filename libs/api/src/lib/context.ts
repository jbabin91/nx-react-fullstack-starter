import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';

type UserSession = {
  user?: {
    name?: string;
    email?: string;
  };
};

export async function createContext({
  req,
  res,
}: CreateExpressContextOptions): Promise<
  Omit<CreateExpressContextOptions, 'info'> & { session: UserSession }
> {
  const session = {
    user: {
      email: 'test@example.com',
      name: 'Jace',
    },
  };

  return {
    req,
    res,
    session,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
