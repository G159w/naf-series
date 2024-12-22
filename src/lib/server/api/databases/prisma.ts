import { NODE_ENV } from '$env/static/private';
import { injectable } from '@needle-di/core';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import { withOptimize } from '@prisma/extension-optimize';

const createPrismaClient = () =>
  new PrismaClient()
    .$extends(withOptimize({ apiKey: process.env.OPTIMIZE_API_KEY || '' }))
    .$extends(withAccelerate());

const globalForPrisma = globalThis as unknown as { prisma: ReturnType<typeof createPrismaClient> };

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

@injectable()
export class PrismaService {
  public db: typeof prisma;
  constructor() {
    this.db = prisma;
  }
}