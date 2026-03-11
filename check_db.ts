import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function check() {
  const count = await prisma.order.count();
  const latest = await prisma.order.findFirst({
    orderBy: { createdAt: "desc" },
  });
  console.log(`Total records: ${count}`);
  console.log(`Latest record:`, JSON.stringify(latest, null, 2));
}

check()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
