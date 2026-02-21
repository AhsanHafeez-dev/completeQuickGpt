
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
const connectionString = `${process.env.DATABASE_URL}`;
const adapter=new PrismaBetterSqlite3({url:connectionString})
const prisma = new PrismaClient({adapter});

await prisma.message.deleteMany({});

export { prisma };