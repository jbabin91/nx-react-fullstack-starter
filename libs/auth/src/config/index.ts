import { cleanEnv, num, str } from 'envalid';

export const env = cleanEnv(process.env, {
  ACCESS_TOKEN_EXPIRES_IN: num({
    default: 15,
  }),
  ACCESS_TOKEN_PRIVATE_KEY: str(),
  ACCESS_TOKEN_PUBLIC_KEY: str(),
  JWT_ACCESS_SECRET: str(),
  JWT_REFRESH_SECRET: str(),
  REFRESH_TOKEN_EXPIRES_IN: num({
    default: 60,
  }),
  REFRESH_TOKEN_PRIVATE_KEY: str(),
  REFRESH_TOKEN_PUBLIC_KEY: str(),
});
