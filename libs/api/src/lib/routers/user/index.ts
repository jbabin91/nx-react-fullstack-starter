import { z } from 'zod';

import { updateUserSchema, userSchema } from '../../../schemas/users';
import { publicProcedure, router } from '../../trpc';
import {
  createUser,
  deleteUser,
  getUserByEmail,
  getUserById,
  getUsers,
  updateUser,
} from './user.db';

export const userRouter = router({
  addUser: publicProcedure
    .input(userSchema)
    .mutation(async ({ input }) => await createUser(input)),
  deleteUser: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => await deleteUser(input.id)),
  getUserByEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => await getUserByEmail(input.email)),
  getUserById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => await getUserById(input.id)),
  getUsers: publicProcedure.query(async () => await getUsers()),
  updateUser: publicProcedure
    .input(updateUserSchema)
    .mutation(async ({ input }) => await updateUser(input)),
});
