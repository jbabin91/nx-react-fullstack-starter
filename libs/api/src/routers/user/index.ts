import { updateUserSchema } from '@repo/db';
import { z } from 'zod';

import {
  deleteUser,
  findUserByEmail,
  findUserById,
  getUsers,
  updateUser,
} from '../../services/user.db';
import { isAuthorizedProcedure, publicProcedure, router } from '../../trpc';

export const userRouter = router({
  delete: isAuthorizedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => await deleteUser(input.id)),
  getByEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => await findUserByEmail({ email: input.email })),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => await findUserById(input.id)),
  list: publicProcedure.query(async () => await getUsers()),
  update: isAuthorizedProcedure
    .input(updateUserSchema)
    .mutation(async ({ input }) => await updateUser(input)),
});
