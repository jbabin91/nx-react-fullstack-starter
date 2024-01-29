import { verifyJwt } from '@repo/auth';
import type { UserResponse } from '@repo/db';
import { TRPCError } from '@trpc/server';
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';

import { redisClient } from '../lib/redis-client';
import { findUserById } from '../services/user.db';

async function deserializeUser({
  req,
  res,
  info,
}: CreateExpressContextOptions): Promise<
  CreateExpressContextOptions & {
    user: UserResponse | null;
  }
> {
  try {
    // Get the Access Token
    let access_token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      access_token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.access_token) {
      access_token = req.cookies.access_token;
    }

    const notAuthenticated = {
      info,
      req,
      res,
      user: null,
    };

    if (!access_token) {
      return notAuthenticated;
    }

    // key: 'accessTokenPublicKey',
    // Validate Access Token
    const decoded = verifyJwt<{ sub: string }>({
      key: 'ACCESS_TOKEN_PUBLIC_KEY',
      token: access_token,
    });

    if (!decoded) {
      return notAuthenticated;
    }

    // Check if user has a valid session
    const session = await redisClient.get(decoded.sub);
    if (!session) {
      return notAuthenticated;
    }

    // Check if user still exist
    const user = await findUserById(decoded.sub);
    if (!user) {
      return notAuthenticated;
    }

    return {
      info,
      req,
      res,
      user,
    };
  } catch (error: any) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message,
    });
  }
}

export { deserializeUser };
