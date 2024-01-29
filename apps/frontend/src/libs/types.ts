import { z } from 'zod';

export const userSchema = z
  .object({
    createdAt: z.string(),
    email: z.string().email(),
    id: z.string(),
    role: z.enum(['ADMIN', 'USER']),
    updatedAt: z.string(),
  })
  .partial();
export type IUser = z.infer<typeof userSchema>;
// export type IUser = {
//   name?: string;
//   email?: string;
//   role?: string;
//   id?: string;
//   createdAt?: string;
//   updatedAt?: string;
//   password?: string;
// };

export const role = {
  Admin: 'ADMIN',
  User: 'USER',
} as const;

export type Role = (typeof role)[keyof typeof role];
export type Roles = Role[];
