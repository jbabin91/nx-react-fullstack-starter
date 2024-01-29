import { createId } from '@paralleldrive/cuid2';
import { Prisma } from '@prisma/client';
import {
  comparePasswords,
  generateTokens,
  signJwt,
  signTokens,
  verifyJwt,
} from '@repo/auth';
import type { LoginInput, RegisterInput, UserResponse } from '@repo/db';
import { TRPCError } from '@trpc/server';
import type { CookieOptions } from 'express';
import * as jwt from 'jsonwebtoken';
import { omit } from 'lodash-es';

import { env } from '../config';
import { prisma } from '../lib/prisma-client';
import { redisClient } from '../lib/redis-client';
import {
  addRefreshTokenToWhitelist,
  deleteRefreshToken,
  findRefreshTokenById,
} from '../services/auth.db';
import { createUser, findUserByEmail, findUserById } from '../services/user.db';
import type { Context } from '../trpc/context';

const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: env.NODE_ENV === 'production',
};

// Cookie Options
const accessTokenCookieOptions = {
  ...cookieOptions,
  expires: new Date(Date.now() + env.ACCESS_TOKEN_EXPIRES_IN * 60 * 1000),
};

const refreshTokenCookieOptions = {
  ...cookieOptions,
  expires: new Date(Date.now() + env.REFRESH_TOKEN_EXPIRES_IN * 60 * 1000),
};

// Register User
async function registerHandler({ input }: { input: RegisterInput }) {
  try {
    const user = await createUser({
      data: {
        email: input.email,
        name: input.name,
        password: input.password,
      },
    });

    return {
      data: {
        user,
      },
      status: 'success',
    };
  } catch (error: any) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Email already exists',
      });
    }
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message,
    });
  }
}

// Login User
async function loginHandler({
  input,
  ctx,
}: {
  input: LoginInput;
  ctx: Context;
}): Promise<{ access_token: string; status: string; user: UserResponse }> {
  try {
    const user = await findUserByEmail({ email: input.email });

    if (
      !user ||
      (user?.password &&
        !comparePasswords({
          hashedPassword: input.password,
          password: user?.password,
        }))
    ) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invalid email or password',
      });
    }

    // Create the Access and refresh tokens
    const { access_token, refresh_token } = await signTokens({ user });

    redisClient.set(`${user.id}`, JSON.stringify(user), { EX: 60 * 60 });

    // Send Access Token in Cookie
    ctx.res.cookie('access_token', access_token, accessTokenCookieOptions);
    ctx.res.cookie('refresh_token', refresh_token, refreshTokenCookieOptions);
    ctx.res.cookie('logged_in', true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    // Send Access Token
    return {
      access_token,
      status: 'success',
      user: omit(user, ['password']),
    };
  } catch (error: any) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message,
    });
  }
}

// Refresh tokens handler
async function refreshAccessTokenHandler({ ctx }: { ctx: Context }) {
  try {
    // Get the refresh token from cookie
    const refresh_token = ctx.req.cookies.refresh_token as string;

    const message = 'Could not refresh access token';
    if (!refresh_token) {
      throw new TRPCError({ code: 'FORBIDDEN', message });
    }

    // key: 'refreshTokenPublicKey',
    // Validate the Refresh token
    const decoded = verifyJwt<{ sub: string }>({
      key: 'REFRESH_TOKEN_PUBLIC_KEY',
      token: refresh_token,
    });

    if (!decoded) {
      throw new TRPCError({ code: 'FORBIDDEN', message });
    }

    // Check if the user has a valid session
    const session = await redisClient.get(decoded.sub);
    if (!session) {
      throw new TRPCError({ code: 'FORBIDDEN', message });
    }

    // Check if the user exist
    const user = await findUserById(decoded.sub);

    if (!user) {
      throw new TRPCError({ code: 'FORBIDDEN', message });
    }

    // key: 'accessTokenPrivateKey',
    // Sign new access token
    const access_token = signJwt({
      key: 'ACCESS_TOKEN_PRIVATE_KEY',
      options: {
        expiresIn: `${env.ACCESS_TOKEN_EXPIRES_IN}m`,
      },
      payload: { sub: user.id },
    });

    // Send the access token as cookie
    ctx.res.cookie('access_token', access_token, accessTokenCookieOptions);
    ctx.res.cookie('logged_in', true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    // Send response
    return {
      access_token,
      status: 'success',
    };
  } catch (error: any) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message,
    });
  }
}

// Logout handler
function logout({ ctx }: { ctx: Context }) {
  ctx.res.cookie('access_token', '', { maxAge: -1 });
  ctx.res.cookie('refresh_token', '', { maxAge: -1 });
  ctx.res.cookie('logged_in', '', { maxAge: -1 });
}

async function logoutHandler({ ctx }: { ctx: Context }) {
  try {
    // TODO: Remove the user from redis
    const user = ctx.user;
    await redisClient.del(user?.id as string);
    logout({ ctx });
    return {
      message: 'success',
    };
  } catch (error: any) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message,
    });
  }
}

export {
  loginHandler,
  logoutHandler,
  refreshAccessTokenHandler,
  registerHandler,
};

////////////////////////////////
////////// OLD HANDLERS ////////
////////////////////////////////

export async function loginUser({
  data,
}: {
  data: LoginInput;
}): Promise<{ accessToken: string; refreshToken: string }> {
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
    hashedPassword: existingUser?.password ?? '',
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

export async function refreshToken({
  refreshToken,
}: {
  refreshToken: string;
}): Promise<{ accessToken: string; refreshToken: string }> {
  if (!refreshToken) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
    });
  }

  const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as {
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

export async function revokeTokens({
  userId,
}: {
  userId: string;
}): Promise<{ message: string }> {
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
