import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';

import { deserializeUser } from '../middleware/deserializeUser';

export const createContext = async ({
  req,
  res,
}: CreateExpressContextOptions) => deserializeUser({ req, res });

// export async function createContext({
//   req,
//   res,
// }: CreateExpressContextOptions): Promise<
//   Omit<CreateExpressContextOptions, 'info'> & { session: UserSession }
// > {
//   const session = {
//     user: {
//       email: 'test@example.com',
//       name: 'Jace',
//     },
//   };

//   return {
//     req,
//     res,
//     session,
//   };
// }

export type Context = Awaited<ReturnType<typeof createContext>>;
