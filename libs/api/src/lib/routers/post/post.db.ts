import { PrismaClient } from '@prisma/client';
import type { CreatePost, Post, Posts, UpdatePost } from '@repo/db';
import { createPostSchema, updatePostSchema } from '@repo/db';

const prisma = new PrismaClient();

/**
 * Retrieves all posts from the database.
 * @returns {Promise<Posts>} A promise that resolves to an array of posts.
 */
export const getPosts = async (): Promise<Posts> => {
  const posts = await prisma.post.findMany();

  return posts;
};

/**
 * Retrieves a post by its ID.
 * @param id - The ID of the post.
 * @returns {Promise<Post | null>} A promise that resolves to the post object if found, or null if not found.
 */
export const getPostById = async (id: string): Promise<Post | null> => {
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
  });

  return post;
};

/**
 * Retrieves posts by user ID.
 * @param id - The ID of the user.
 * @returns {Promise<Posts>} A promise that resolves to an array of posts.
 */
export const getPostsByUserId = async (id: string): Promise<Posts> => {
  const posts = await prisma.post.findMany({
    where: {
      authorId: id,
    },
  });

  return posts;
};

/**
 * Creates a new post.
 * @param {CreatePost} data The data for the post.
 * @returns {Promise<Post>} A promise that resolves to the created post.
 * @throws {Error} An error if the post data is invalid.
 */
export const createPost = async (data: CreatePost): Promise<Post> => {
  const post = createPostSchema.safeParse(data);

  if (!post.success) {
    throw new Error('Invalid post data');
  }

  const createdPost = await prisma.post.create({
    data: post.data,
  });

  return createdPost;
};

/**
 * Updates a post in the database.
 * @param {UpdatePost} data - The data to update the post with.
 * @returns {Promise<Post>} A promise that resolves to the updated post.
 * @throws {Error} An error if the post data is invalid.
 */
export const updatePost = async (data: UpdatePost): Promise<Post> => {
  const post = updatePostSchema.safeParse(data);

  if (!post.success) {
    throw new Error('Invalid post data');
  }

  const updatedPost = await prisma.post.update({
    data: post.data,
    where: {
      id: post.data.id,
    },
  });

  return updatedPost;
};

/**
 * Deletes a post from the database.
 * @param {string} id - The ID of the post to delete.
 * @returns {Promise<Post>} A Promise that resolves to the deleted post.
 */
export const deletePost = async (id: string): Promise<Post> => {
  const deletedPost = await prisma.post.delete({
    where: {
      id,
    },
  });

  return deletedPost;
};
