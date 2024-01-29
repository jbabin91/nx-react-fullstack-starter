import { hashPassword } from '@repo/auth';
import type { CreateUser, UpdateUser, User, UserResponse } from '@repo/db';
import { createUserSchema, excludeFields, updateUserSchema } from '@repo/db';
import { TRPCError } from '@trpc/server';

import { prisma } from '../lib/prisma-client';

const select = excludeFields(prisma.user.fields, ['password']);

export async function getUsers(): Promise<User[]> {
  return await prisma.user.findMany({ select });
}

export async function findUserById(id: string): Promise<UserResponse | null> {
  const user = await prisma.user.findUnique({
    select,
    where: {
      id,
    },
  });
  return user;
}

export async function findUserByEmail({
  email,
}: {
  email: string;
}): Promise<User | null> {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export async function createUser({ data }: { data: CreateUser }) {
  const user = createUserSchema.safeParse(data);

  if (!user.success) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
    });
  }

  user.data.password = hashPassword({ password: user.data.password });

  return await prisma.user.create({
    data: user.data,
    select,
  });
}

export function updateUser({ data }: { data: UpdateUser }) {
  const user = updateUserSchema.safeParse(data);

  if (!user.success) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
    });
  }

  const updatedUser = prisma.user.update({
    data: user.data,
    select,
    where: {
      id: user.data.id,
    },
  });

  return updatedUser;
}

export function deleteUser({ id }: { id: string }) {
  const deletedUser = prisma.user.delete({
    where: {
      id,
    },
  });

  return deletedUser;
}
