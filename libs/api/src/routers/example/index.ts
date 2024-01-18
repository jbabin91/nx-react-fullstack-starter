import { redisClient } from '../../lib/redis-client';
import { publicProcedure, router } from '../../trpc';

export const exampleRouter = router({
  goodbye: publicProcedure.query(() => {
    return {
      message: 'goodbye!',
    };
  }),
  hello: publicProcedure.query(() => {
    return {
      message: 'hello world',
    };
  }),
  sayHello: publicProcedure.query(async () => {
    const message = await redisClient.get('tRPC');
    return { message };
  }),
});
