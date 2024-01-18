import { router } from '../trpc';
import { exampleRouter } from './example';
import { postRouter } from './post';
import { userRouter } from './user';

export const appRouter = router({
  example: exampleRouter,
  post: postRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
