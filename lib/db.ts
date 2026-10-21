// Single source of truth — re-exports from lib/db/prisma.ts
// Do NOT create a second PrismaClient here.
export { prisma, db } from "./db/prisma";
