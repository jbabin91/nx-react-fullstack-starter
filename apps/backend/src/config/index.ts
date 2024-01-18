import { cleanEnv, port, str } from 'envalid';

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ['development', 'test', 'production', 'staging'],
    default: 'development',
  }),
  ORIGIN: str({
    default: 'http://localhost:3333',
  }),
  PORT: port({
    default: 3333,
  }),
});
