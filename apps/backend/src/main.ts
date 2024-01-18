/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import * as path from 'node:path';

import { appRouter, createContext } from '@repo/api';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import { env } from './config';

const port = env.PORT;
const origin = env.ORIGIN || `http://localhost:${port}`;

const app = express();
if (env.NODE_ENV !== 'production') app.use(morgan('dev'));

app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: [origin, `http://localhost:${port}`],
  }),
);

app.use('/assets', express.static(path.join(__dirname, 'assets')));

// TODO: should we switch to /api/trpc ?
app.use(
  '/trpc',
  createExpressMiddleware({
    createContext,
    router: appRouter,
  }),
);

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to backend!' });
});

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
