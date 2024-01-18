import { Prisma } from '@prisma/client';
import { comparePasswords, signJwt, signTokens, verifyJwt } from '@repo/auth';
import type { CreateUser, LoginInput } from '@repo/db';
import { TRPCError } from '@trpc/server';
import type { CookieOptions } from 'express';

import { envConfig } from '../config';
import { redisClient } from '../lib/redis-client';
import { createUser, findUserByEmail, findUserById } from '../services/user.db';
import type { Context } from '../trpc/context';

const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: envConfig.env === 'production',
};

// Cookie Options
const accessTokenCookieOptions = {
  ...cookieOptions,
  expires: new Date(Date.now() + envConfig.accessTokenExpiresIn * 60 * 1000),
};

const refreshTokenCookieOptions = {
  ...cookieOptions,
  expires: new Date(Date.now() + envConfig.refreshTokenExpiresIn * 60 * 1000),
};

// Register User
async function registerHandler({ input }: { input: CreateUser }) {
  try {
    const user = await createUser({
      email: input.email,
      name: input.name,
      password: input.password,
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
}) {
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

    // Validate the Refresh token
    const decoded = verifyJwt<{ sub: string }>({
      key: 'refreshTokenPublicKey',
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

    // Sign new access token
    const access_token = signJwt({
      key: 'accessTokenPrivateKey',
      options: {
        expiresIn: `${envConfig.accessTokenExpiresIn}m`,
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
