
// Pg Bouncer
import { PrismaPg } from "@prisma/adapter-pg";
// prisma client
import { PrismaClient } from "@prisma/client";

// connection url
const connectionString = `${process.env.DATABASE_URL}`;

// adapter initialization
const adapter = new PrismaPg({ connectionString });
// initializing prisma
// with pg adapter
const prisma = new PrismaClient({ adapter });


// exporting 
export { prisma };

// in this project we are currently using neon db
// we are also using latest prisma edition
// you can use prisma 6 if you want 
// mostly things are same its just prisma.confifg.ts