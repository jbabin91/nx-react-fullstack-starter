import type { User } from '@repo/db';
import * as jwt from 'jsonwebtoken';

/**
 * Generates an access token for the given user.
 * @param user The user object.
 * @returns The generated access token.
 */
function generateAccessToken(user: User) {
  console.log(import.meta.env['JWT_ACCESS_SECRET']);
  return jwt.sign({ userId: user.id }, import.meta.env['JWT_ACCESS_SECRET'], {
    expiresIn: '5m', // Usually I keep the token between 5 minutes - 15 minutes
  });
}

function generateRefreshToken(user: User, jti: string) {
  // I chose 8h because i prefer to make the user login again each day.
  // But keep him logged in if he is using the app.
  // You can change this value depending on your app logic.
  // I would go for a maximum of 7 days, and make him login again after 7 days of inactivity.
  return jwt.sign(
    {
      jti,
      userId: user.id,
    },
    import.meta.env['JWT_REFRESH_SECRET'],
    {
      expiresIn: '8h',
    },
  );
}

function generateTokens(user: User, jti: string) {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user, jti);

  return {
    accessToken,
    refreshToken,
  };
}

export { generateAccessToken, generateRefreshToken, generateTokens };
