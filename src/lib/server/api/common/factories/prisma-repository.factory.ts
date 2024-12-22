import { Container } from '@needle-di/core';

import { PrismaService } from '../../databases/prisma';

export abstract class PrismaRepository {
  protected readonly prisma: PrismaService;
  constructor() {
    this.prisma = new Container().get(PrismaService);
  }
}
