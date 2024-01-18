import { publicProcedure, router } from '../../lib/trpc';

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
});
