import { createId } from '@paralleldrive/cuid2';
import type { RefreshToken } from '@prisma/client';
import { comparePasswords, generateTokens, hashToken } from '@repo/auth';
import type { AddRefreshToken, CreateUser, LoginInput } from '@repo/db';
import { TRPCError } from '@trpc/server';
import * as jwt from 'jsonwebtoken';

import { envConfig } from '../config';
import { prisma } from '../lib/prisma-client';
import { createUser, findUserByEmail, findUserById } from './user.db';

type SessionResponse = {
  accessToken: string;
  refreshToken: string;
};

type ResponseMessage = {
  message: string;
};

/**
 * Registers a new user with the provided data.
 *
 * @param data The user data including email, name, and password.
 * @returns A promise that resolves to an object containing the access token and refresh token.
 * @throws {TRPCError} If the email or password is missing, or if a user with the same email already exists.
 */
export async function registerUser({
  data,
}: {
  data: CreateUser;
}): Promise<SessionResponse> {
  const { email, password } = data;

  if (!email || !password) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
    });
  }

  const existingUser = await findUserByEmail({ email });

  if (existingUser) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
    });
  }

  const user = await createUser(data);
  const jti = createId();
  const { accessToken, refreshToken } = generateTokens(user, jti);
  await addRefreshTokenToWhitelist({ jti, refreshToken, userId: user.id });

  return {
    accessToken,
    refreshToken,
  };
}

/**
 * Logs in a user with the provided email and password.
 *
 * @param data The user's email and password.
 * @returns A promise that resolves to an object containing the access token and refresh token.
 * @throws {TRPCError} If the email or password is missing, or if the login credentials are invalid.
 */
export async function loginUser({
  data,
}: {
  data: LoginInput;
}): Promise<SessionResponse> {
  const { email, password } = data;

  if (!email || !password) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
    });
  }

  const existingUser = await findUserByEmail({ email });
  if (!existingUser) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Invalid login credentials.',
    });
  }

  const validPassword = comparePasswords({
    hashedPassword: existingUser.password,
    password,
  });
  if (!validPassword) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Invalid login credentials.',
    });
  }

  const jti = createId();
  const { accessToken, refreshToken } = generateTokens(existingUser, jti);
  await addRefreshTokenToWhitelist({
    jti,
    refreshToken,
    userId: existingUser.id,
  });

  return {
    accessToken,
    refreshToken,
  };
}

/**
 * Refreshes the access token using the provided refresh token.
 *
 * @param refreshToken The refresh token used to generate a new access token.
 * @returns A promise that resolves to an object containing the new access token and refresh token.
 * @throws {TRPCError} If the refresh token is missing, invalid, or revoked, or if the user associated with the refresh token is not found.
 */
export async function refreshToken({
  refreshToken,
}: {
  refreshToken: string;
}): Promise<SessionResponse> {
  if (!refreshToken) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
    });
  }

  const payload = jwt.verify(refreshToken, envConfig.jwtRefreshSecret) as {
    jti: string;
    userId: string;
    refreshToken: string;
  };
  const savedRefreshToken = await findRefreshTokenById({ id: payload.jti });

  if (!savedRefreshToken || savedRefreshToken.revoked === true) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    });
  }

  const user = await findUserById(payload.userId);
  if (!user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    });
  }

  await deleteRefreshToken({ id: savedRefreshToken.id });
  const jti = createId();
  const { accessToken, refreshToken: newRefreshToken } = generateTokens(
    user,
    jti,
  );
  await addRefreshTokenToWhitelist({
    jti,
    refreshToken: newRefreshToken,
    userId: user.id,
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
}

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

/**
 * Revokes all tokens for a given user.
 *
 * @param {Object} params The parameters for revoking tokens.
 * @param {string} params.userId The ID of the user.
 * @returns {Promise<ResponseMessage>} A promise that resolves to an object with a message indicating the tokens were revoked.
 */
export async function revokeTokens({
  userId,
}: {
  userId: string;
}): Promise<ResponseMessage> {
  await prisma.refreshToken.updateMany({
    data: {
      revoked: true,
    },
    where: {
      userId,
    },
  });

  return {
    message: `Tokens revoked for user with id #${userId}`,
  };
}
