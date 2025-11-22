import { prisma } from "./prisma";
import { seedUsers } from "./user";

export const main = async () => {
  await seedUsers();
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
