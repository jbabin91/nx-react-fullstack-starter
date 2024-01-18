export const envConfig: {
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
  accessTokenPrivateKey: string;
  accessTokenPublicKey: string;
  refreshTokenPrivateKey: string;
  refreshTokenPublicKey: string;
  jwtAccessSecret: string;
  jwtRefreshSecret: string;
} = {
  accessTokenExpiresIn: 15,
  accessTokenPrivateKey: process.env['ACCESS_TOKEN_PRIVATE_KEY'] as string,
  accessTokenPublicKey: process.env['ACCESS_TOKEN_PUBLIC_KEY'] as string,
  jwtAccessSecret: process.env['JWT_ACCESS_SECRET'] as string,
  jwtRefreshSecret: process.env['JWT_REFRESH_SECRET'] as string,
  refreshTokenExpiresIn: 60,
  refreshTokenPrivateKey: process.env['REFRESH_TOKEN_PRIVATE_KEY'] as string,
  refreshTokenPublicKey: process.env['REFRESH_TOKEN_PUBLIC_KEY'] as string,
};
