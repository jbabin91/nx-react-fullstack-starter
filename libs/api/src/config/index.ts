export const envConfig: {
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
  accessTokenPrivateKey: string;
  accessTokenPublicKey: string;
  refreshTokenPrivateKey: string;
  refreshTokenPublicKey: string;
  jwtAccessSecret: string;
  jwtRefreshSecret: string;
  env: 'development' | 'test' | 'production';
} = {
  accessTokenExpiresIn: 15,
  accessTokenPrivateKey: import.meta.env['ACCESS_TOKEN_PRIVATE_KEY'] as string,
  accessTokenPublicKey: import.meta.env['ACCESS_TOKEN_PUBLIC_KEY'] as string,
  env: import.meta.env['NODE_ENV'] as 'development' | 'test' | 'production',
  jwtAccessSecret: import.meta.env['JWT_ACCESS_SECRET'] as string,
  jwtRefreshSecret: import.meta.env['JWT_REFRESH_SECRET'] as string,
  refreshTokenExpiresIn: 60,
  refreshTokenPrivateKey: import.meta.env[
    'REFRESH_TOKEN_PRIVATE_KEY'
  ] as string,
  refreshTokenPublicKey: import.meta.env['REFRESH_TOKEN_PUBLIC_KEY'] as string,
};
