import type { User } from '@repo/db';
import type { SignOptions } from 'jsonwebtoken';
import { sign, verify } from 'jsonwebtoken';

import { envConfig } from '../config';

/**
 * Signs a JWT token for the given user.
 *
 * @param user The user object.
 * @returns An object containing the access token and refresh token.
 */
async function signTokens({
  user,
}: {
  user: User;
}): Promise<{ access_token: string; refresh_token: string }> {
  const userId = user.id;

  // Sign the access token
  const access_token = signJwt({
    key: 'accessTokenPrivateKey',
    options: {
      expiresIn: `${envConfig.accessTokenExpiresIn}m`,
    },
    payload: { sub: userId },
  });

  // Sign the refresh token
  const refresh_token = signJwt({
    key: 'refreshTokenPrivateKey',
    options: {
      expiresIn: `${envConfig.refreshTokenExpiresIn}m`,
    },
    payload: { sub: userId },
  });

  // TODO: Create a session in redis
  // redisClient.set(userId, JSON.stringify(user), { EX: 60 * 60 });

  return {
    access_token,
    refresh_token,
  };
}

function signJwt({
  payload,
  key,
  options = {},
}: {
  payload: object;
  key: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey';
  options: SignOptions;
}) {
  try {
    const privateKey = Buffer.from(envConfig[key], 'base64').toString('ascii');
    return sign(payload, privateKey, {
      ...(options && options),
      algorithm: 'RS256',
    });
  } catch (error: any) {
    console.log(error);
    return '';
  }
}

function verifyJwt<T>({
  token,
  key,
}: {
  token: string;
  key: 'accessTokenPublicKey' | 'refreshTokenPublicKey';
}): T | null {
  try {
    const publicKey = Buffer.from(envConfig[key], 'base64').toString('ascii');
    return verify(token, publicKey) as T;
  } catch (error) {
    console.error(error);
    return null;
  }
}

////////////////// OLD CODE ////////////////////
/**
 * Generates an access token for the given user.
 * @param user The user object.
 * @returns The generated access token.
 */
function generateAccessToken(user: User): string {
  return sign({ userId: user.id }, envConfig['jwtAccessSecret'], {
    expiresIn: '5m', // Usually I keep the token between 5 minutes - 15 minutes
  });
}

function generateRefreshToken(user: User, jti: string): string {
  // I chose 8h because i prefer to make the user login again each day.
  // But keep him logged in if he is using the app.
  // You can change this value depending on your app logic.
  // I would go for a maximum of 7 days, and make him login again after 7 days of inactivity.
  return sign(
    {
      jti,
      userId: user.id,
    },
    envConfig['jwtRefreshSecret'],
    {
      expiresIn: '8h',
    },
  );
}

function generateTokens(
  user: User,
  jti: string,
): { accessToken: string; refreshToken: string } {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user, jti);

  return {
    accessToken,
    refreshToken,
  };
}
////////////////// OLD CODE ////////////////////

export {
  generateTokens, // TODO: Look into combining this with signToken
  signJwt,
  // NEW basically the same thing as generateTokens
  verifyJwt,
};

export { signTokens };
