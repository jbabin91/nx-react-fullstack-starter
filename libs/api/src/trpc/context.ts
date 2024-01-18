import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';

import { deserializeUser } from '../middleware/deserializeUser';

export const createContext = async ({
  req,
  res,
}: CreateExpressContextOptions) => deserializeUser({ req, res });

export type Context = Awaited<ReturnType<typeof createContext>>;
