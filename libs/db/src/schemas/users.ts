import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
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
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long',
  }),
});
export type CreateUser = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['ADMIN', 'USER']),
});
export type UpdateUser = z.infer<typeof updateUserSchema>;

export const loginUserSchema = z.object({
  email: z.string(),
  password: z.string(),
});
export type LoginUser = z.infer<typeof loginUserSchema>;
