import { PrismaClient } from '@prisma/client';

import { envConfig } from '../config';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'info', 'warn'],
  });

if (envConfig.env !== 'production') globalForPrisma.prisma = prisma;
