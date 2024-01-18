import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['ADMIN', 'USER']),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type User = z.infer<typeof userSchema>;

export const usersSchema = z.array(userSchema);
export type Users = z.infer<typeof usersSchema>;

export const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});
export type CreateUser = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['ADMIN', 'USER']),
});
export type UpdateUser = z.infer<typeof updateUserSchema>;
