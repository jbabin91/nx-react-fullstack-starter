import type { CreateUser, UpdateUser, User } from '@repo/db';
import { createUserSchema, updateUserSchema } from '@repo/db';
import { TRPCError } from '@trpc/server';
import * as bcrypt from 'bcryptjs';

import { prisma } from '../../lib/prisma-client';

/**
 * Retrieves all users from the database.
 *
 * @returns {Promise<User[]>} A promise that resolves to an array of User objects.
 */
export async function getUsers(): Promise<User[]> {
  return await prisma.user.findMany();
}

/**
 * Retrieves a user by their ID.
 *
 * @param {string} id The ID of the user.
 * @returns {Promise<User | null>} A promise that resolves to the user object if found, or null if not found.
 */
export async function getUserById(id: string): Promise<User | null> {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
}

/**
 * Retrieves a user from the database based on their email.
 *
 * @param {string} email The email of the user to retrieve.
 * @returns {Promise<User | null>} A Promise that resolves to the user object if found, or null if not found.
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
}

/**
 * Creates a new user.
 *
 * @param {CreateUser} data The user data.
 * @returns {Promise<User>} The created user.
 * @throws {Error} If the user data is invalid.
 */
export async function createUser(data: CreateUser): Promise<User> {
  const user = createUserSchema.safeParse(data);

  if (!user.success) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
    });
  }

  user.data.password = bcrypt.hashSync(user.data.password, 12);

  const createdUser = await prisma.user.create({
    data: user.data,
  });

  return createdUser;
}

/**
 * Updates a user in the database.
 *
 * @param data The data to update the user with.
 * @returns {Promise<User>} The updated user.
 * @throws {TRPCError} Error if the user data is invalid.
 */
export function updateUser(data: UpdateUser): Promise<User> {
  const user = updateUserSchema.safeParse(data);

  if (!user.success) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
    });
  }

  const updatedUser = prisma.user.update({
    data: user.data,
    where: {
      id: user.data.id,
    },
  });

  return updatedUser;
}

/**
 * Deletes a user from the database.
 * @param id The ID of the user to delete.
 * @returns {Promise<User>} The deleted user.
 */
export function deleteUser(id: string): Promise<User> {
  const deletedUser = prisma.user.delete({
    where: {
      id,
    },
  });

  return deletedUser;
}
