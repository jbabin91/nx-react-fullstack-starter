import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';

import { deserializeUser } from '../middleware/deserializeUser';

export const createContext = async ({
  req,
  res,
  info,
}: CreateExpressContextOptions) => deserializeUser({ info, req, res });

export type Context = Awaited<ReturnType<typeof createContext>>;
