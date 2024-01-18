import { z } from 'zod';

import { createPostSchema, updatePostSchema } from '../../../schemas/posts';
import { publicProcedure, router } from '../../trpc';
import {
  createPost,
  deletePost,
  getPostById,
  getPosts,
  getPostsByUserId,
  updatePost,
} from './post.db';

export const postRouter = router({
  createPost: publicProcedure
    .input(createPostSchema)
    .mutation(async ({ input }) => await createPost(input)),
  deletePost: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => await deletePost(input.id)),
  getPostById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => await getPostById(input.id)),
  getPosts: publicProcedure.query(async () => await getPosts()),
  getPostsByUserId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => await getPostsByUserId(input.id)),
  updatePost: publicProcedure
    .input(updatePostSchema)
    .mutation(async ({ input }) => await updatePost(input)),
});
