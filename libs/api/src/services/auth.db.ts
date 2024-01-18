import type { RefreshToken } from '@prisma/client';
import { hashToken } from '@repo/auth';
import type { AddRefreshToken } from '@repo/db';

import { prisma } from '../lib/prisma-client';

/**
 * Adds a refresh token to the whitelist.
 *
 * @param {Object} params The parameters for adding a refresh token.
 * @param {string} params.jti The unique identifier for the token.
 * @param {string} params.refreshToken The refresh token.
 * @param {string} params.userId The ID of the user.
 * @returns {Promise<RefreshToken>} A promise that resolves to the created refresh token.
 */
export async function addRefreshTokenToWhitelist({
  jti,
  refreshToken,
  userId,
}: AddRefreshToken): Promise<RefreshToken> {
  return await prisma.refreshToken.create({
    data: {
      hashedToken: hashToken({ token: refreshToken }),
      id: jti,
      userId,
    },
  });
}

/**
 * Finds a refresh token by its ID.
 *
 * @param {Object} params The parameters for finding the refresh token.
 * @param {string} params.id The ID of the refresh token.
 * @returns {Promise<RefreshToken | null>} The found refresh token or null if not found.
 */
export async function findRefreshTokenById({
  id,
}: {
  id: string;
}): Promise<RefreshToken | null> {
  return await prisma.refreshToken.findUnique({
    where: {
      id,
    },
  });
}

/**
 * Deletes a refresh token by its ID.
 *
 * @param {Object} params The parameters for deleting the refresh token.
 * @param {string} params.id The ID of the refresh token to delete.
 * @returns {Promise<RefreshToken>} A promise that resolves to the deleted refresh token object.
 */
export async function deleteRefreshToken({
  id,
}: {
  id: string;
}): Promise<RefreshToken> {
  return await prisma.refreshToken.update({
    data: {
      revoked: true,
    },
    where: {
      id,
    },
  });
}
