import type { CreatePost, Post, Posts, UpdatePost } from '@repo/db';
import { createPostSchema, updatePostSchema } from '@repo/db';
import { TRPCError } from '@trpc/server';

import { prisma } from '../../lib/prisma-client';

/**
 * Retrieves all posts from the database.
 *
 * @returns A promise that resolves to an array of post objects.
 */
export async function getPosts(): Promise<Posts> {
  return await prisma.post.findMany();
}

/**
 * Retrieves a post by its ID.
 *
 * @param {string} id The ID of the post.
 * @returns {Promise<Post | null>} The post object if found, or null if not found.
 */
export async function getPostById({
  id,
}: {
  id: string;
}): Promise<Post | null> {
  return await prisma.post.findUnique({
    where: {
      id,
    },
  });
}

/**
 * Retrieves posts by user ID.
 *
 * @param {string} id The ID of the user.
 * @returns {Promise<Posts>} The array of posts.
 */
export async function getPostsByUserId({ id }: { id: string }): Promise<Posts> {
  return await prisma.post.findMany({
    where: {
      authorId: id,
    },
  });
}

/**
 * Creates a new post.
 *
 * @param data The data for the new post.
 * @returns A promise that resolves to the created post.
 * @throws TRPCError if the data is invalid.
 */
export async function createPost({
  data,
}: {
  data: CreatePost;
}): Promise<Post> {
  const post = createPostSchema.safeParse(data);

  if (!post.success) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
    });
  }

  const createdPost = await prisma.post.create({
    data: post.data,
  });

  return createdPost;
}

/**
 * Updates a post in the database.
 *
 * @param data The data of the post to be updated.
 * @returns A promise that resolves to the updated post.
 * @throws TRPCError if the post data is invalid.
 */
export async function updatePost({
  data,
}: {
  data: UpdatePost;
}): Promise<Post> {
  const post = updatePostSchema.safeParse(data);

  if (!post.success) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
    });
  }

  const updatedPost = await prisma.post.update({
    data: post.data,
    where: {
      id: post.data.id,
    },
  });

  return updatedPost;
}

/**
 * Deletes a post from the database.
 *
 * @param {Object} params The parameters for deleting a post.
 * @param {string} params.id The ID of the post to be deleted.
 * @returns {Promise<Object>} A promise that resolves to the deleted post.
 */
export async function deletePost({ id }: { id: string }): Promise<Post> {
  const deletedPost = await prisma.post.delete({
    where: {
      id,
    },
  });

  return deletedPost;
}
