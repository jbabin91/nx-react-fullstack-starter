import { publicProcedure, router } from '../../trpc';
import { getPosts } from './post.db';

export const postRouter = router({
  getPosts: publicProcedure.query(async () => {
    const posts = await getPosts();
    return posts;
  }),
});
