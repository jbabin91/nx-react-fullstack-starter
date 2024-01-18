import { publicProcedure, router } from '../../trpc';
import { getUsers } from './user.db';

export const userRouter = router({
  getUsers: publicProcedure.query(async () => {
    const users = await getUsers();
    return users;
  }),
});
