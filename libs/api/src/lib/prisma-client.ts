import { PrismaClient } from '@prisma/client';

import { env } from '../config';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'info', 'warn'],
  });

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
