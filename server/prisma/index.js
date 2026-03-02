
// Pg Bouncer
import { PrismaPg } from "@prisma/adapter-pg";
// prisma client
import { PrismaClient } from "@prisma/client";

// connection url
const connectionString = `${process.env.DATABASE_URL}`;

// adapter initialization
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });


export { prisma };