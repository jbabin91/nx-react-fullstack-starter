import { z } from 'zod';

export const registerUserSchema = z
  .object({
    name: z.string().min(1, 'Full name is required').max(100),
    email: z.string().min(1, 'Email is required').email('Email is invalid'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .max(32, 'Password must be less than 32 characters'),
    passwordConfirm: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Passwords do not match',
  });
export type RegisterInput = z.infer<typeof registerUserSchema>;

export const loginUserSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: 'Email is required',
    })
    .email('Email is invalid'),
  password: z
    .string()
    .min(1, {
      message: 'Password is required',
    })
    .min(8, 'Password must be at least 8 characters')
    .max(32, 'Password must be less than 32 characters'),
});
export type LoginInput = z.infer<typeof loginUserSchema>;
