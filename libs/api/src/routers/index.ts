import { router } from '../trpc';
import { authRouter } from './auth';
import { exampleRouter } from './example';
import { postRouter } from './post';
import { userRouter } from './user';

export const appRouter = router({
  auth: authRouter,
  example: exampleRouter,
  post: postRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
