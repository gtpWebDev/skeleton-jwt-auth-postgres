const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await createSingleRecord();
  await getAllRecords();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

async function createSingleRecord() {
  // returns a PrismaPromise
  const user = await prisma.user.create({
    data: {
      username: "glen",
      salt: "gfgfgfgfgf",
      hash: "hsjdshdjsdhjs",
    },
  });
}

async function getAllRecords() {
  const users = await prisma.user.findMany();
  console.log(users);
}
