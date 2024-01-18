import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUsers = async () => await prisma.user.findMany();

export const getUserById = async (id: string) =>
  await prisma.user.findUnique({
    where: {
      id,
    },
  });

export const getUserByEmail = async (email: string) =>
  await prisma.user.findUnique({
    where: {
      email,
    },
  });
