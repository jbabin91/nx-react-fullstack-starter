import { createPostSchema, updatePostSchema } from '@repo/db';
import { z } from 'zod';

import { protectedProcedure, publicProcedure, router } from '../../lib/trpc';
import {
  createPost,
  deletePost,
  getPostById,
  getPosts,
  getPostsByUserId,
  updatePost,
} from './post.db';

export const postRouter = router({
  add: protectedProcedure
    .input(createPostSchema)
    .mutation(async ({ input }) => await createPost({ data: input })),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => await deletePost({ id: input.id })),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => await getPostById({ id: input.id })),
  getByUserId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => await getPostsByUserId({ id: input.id })),
  list: publicProcedure.query(async () => await getPosts()),
  update: protectedProcedure
    .input(updatePostSchema)
    .mutation(async ({ input }) => await updatePost({ data: input })),
});
