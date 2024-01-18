import { publicProcedure, router } from '../../trpc';

export const exampleRouter = router({
  goodBye: publicProcedure.query(() => {
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
