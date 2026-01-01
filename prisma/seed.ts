import { seedDatabase } from "../src/lib/supplement-db";
import { prisma } from "../src/lib/prisma";

async function main() {
  try {
    await seedDatabase();
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
