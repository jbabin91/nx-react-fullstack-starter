import type { TypeOf } from 'zod';
import { array, date, object, string, z } from 'zod';

export const userSchema = object({
  id: string(),
  name: string(),
  email: string().email(),
  password: string().optional(),
  role: z.enum(['ADMIN', 'USER']),
  createdAt: date(),
  updatedAt: date(),
});
export type User = TypeOf<typeof userSchema>;

export const usersSchema = array(userSchema);
export type Users = TypeOf<typeof usersSchema>;

export const createUserSchema = object({
  name: string({ required_error: 'Name is required' }),
  email: string({
    required_error: 'Email is required',
  }).email({
    message: 'Invalid email',
  }),
  password: string({
    required_error: 'Password is required',
  })
    .min(8, {
      message: 'Password must be at least 8 characters long',
    })
    .max(32, {
      message: 'Password must be less than 32 characters long',
    }),
});
export type CreateUser = TypeOf<typeof createUserSchema>;

export const updateUserSchema = object({
  id: string(),
  name: string(),
  email: string().email(),
  role: z.enum(['ADMIN', 'USER']),
});
export type UpdateUser = TypeOf<typeof updateUserSchema>;

export const loginUserSchema = object({
  email: string()
    .min(1, {
      message: 'Email is required',
    })
    .email('Email is invalid'),
  password: string()
    .min(1, {
      message: 'Password is required',
    })
    .min(8, 'Password must be at least 8 characters')
    .max(32, 'Password must be less than 32 characters'),
});
export type LoginInput = TypeOf<typeof loginUserSchema>;

export const registerUserSchema = object({
  name: string().min(1, 'Full name is required').max(100),
  email: string().min(1, 'Email is required').email('Email is invalid'),
  password: string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(32, 'Password must be less than 32 characters'),
  passwordConfirm: string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.passwordConfirm, {
  path: ['passwordConfirm'],
  message: 'Passwords do not match',
});
export type RegisterInput = TypeOf<typeof registerUserSchema>;
