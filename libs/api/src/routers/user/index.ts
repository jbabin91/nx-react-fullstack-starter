import { updateUserSchema } from '@repo/db';
import { z } from 'zod';

import { protectedProcedure, publicProcedure, router } from '../../lib/trpc';
import {
  deleteUser,
  getUserByEmail,
  getUserById,
  getUsers,
  updateUser,
} from './user.db';

export const userRouter = router({
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => await deleteUser(input.id)),
  getByEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => await getUserByEmail(input.email)),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => await getUserById(input.id)),
  list: publicProcedure.query(async () => await getUsers()),
  update: protectedProcedure
    .input(updateUserSchema)
    .mutation(async ({ input }) => await updateUser(input)),
});
