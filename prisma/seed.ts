import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.league.upsert({
    where: { id: "nba" },
    update: {},
    create: { id: "nba", name: "NBA", sportKey: "basketball" },
  });

  await prisma.league.upsert({
    where: { id: "world-cup" },
    update: {},
    create: { id: "world-cup", name: "World Cup", sportKey: "soccer" },
  });

  console.log("Seeded leagues: nba, world-cup");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
