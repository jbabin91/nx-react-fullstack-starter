import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPosts = async () => await prisma.post.findMany();

export const getPostById = async (id: string) =>
  await prisma.post.findUnique({
    where: {
      id,
    },
  });

export const getPostsByUserId = async (id: string) =>
  await prisma.post.findMany({
    where: {
      authorId: id,
    },
  });
