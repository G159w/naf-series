import { PrismaClient } from "@prisma/client"
import { NODE_ENV } from '$env/static/private';

declare global {
  var prisma: PrismaClient | undefined
}

const prisma = globalThis.prisma || new PrismaClient()
if (NODE_ENV !== "production") globalThis.prisma = prisma

export default prisma