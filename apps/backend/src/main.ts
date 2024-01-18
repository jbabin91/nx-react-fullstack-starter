/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import * as path from 'node:path';

import { appRouter, createContext } from '@repo/api';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import cors from 'cors';
import express from 'express';

const app = express();
app.use(cors());

app.use('/assets', express.static(path.join(__dirname, 'assets')));

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

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
