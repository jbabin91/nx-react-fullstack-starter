import { z } from 'zod';

export const postSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  published: z.boolean(),
  authorId: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Post = z.infer<typeof postSchema>;

export const postsSchema = z.array(postSchema);
export type Posts = z.infer<typeof postsSchema>;

export const createPostSchema = z.object({
  title: z.string(),
  content: z.string(),
  published: z.boolean(),
  authorId: z.string().nullable(),
});
export type CreatePost = z.infer<typeof createPostSchema>;

export const updatePostSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  published: z.boolean(),
  authorId: z.string().nullable(),
});
export type UpdatePost = z.infer<typeof updatePostSchema>;
