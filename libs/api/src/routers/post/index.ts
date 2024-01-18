import { createPostSchema, updatePostSchema } from '@repo/db';
import { z } from 'zod';

import {
  createPost,
  deletePost,
  getPostById,
  getPosts,
  getPostsByUserId,
  updatePost,
} from '../../services/post.db';
import { isAuthorizedProcedure, publicProcedure, router } from '../../trpc';

export const postRouter = router({
  add: isAuthorizedProcedure
    .input(createPostSchema)
    .mutation(async ({ input }) => await createPost({ data: input })),
  delete: isAuthorizedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => await deletePost({ id: input.id })),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => await getPostById({ id: input.id })),
  getByUserId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => await getPostsByUserId({ id: input.id })),
  list: publicProcedure.query(async () => await getPosts()),
  update: isAuthorizedProcedure
    .input(updatePostSchema)
    .mutation(async ({ input }) => await updatePost({ data: input })),
});
