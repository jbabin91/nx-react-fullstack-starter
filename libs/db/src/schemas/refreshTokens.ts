import { z } from 'zod';

export const refreshTokenSchema = z.object({
  id: z.string(),
  hashedToken: z.string(),
  revoked: z.boolean(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type RefreshToken = z.infer<typeof refreshTokenSchema>;

export const refreshTokensSchema = z.array(refreshTokenSchema);
export type RefreshTokens = z.infer<typeof refreshTokensSchema>;

export const addRefreshTokenSchema = z.object({
  jti: z.string(),
  refreshToken: z.string(),
  userId: z.string(),
});
export type AddRefreshToken = z.infer<typeof addRefreshTokenSchema>;
