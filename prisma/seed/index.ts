import { prisma } from "./prisma";
import { seedUser } from "./user";

export const main = async () => {
  await seedUser({
    name: "Developer",
    username: "dvlpr",
    password: "fis@1404",
    position: "CTO",
  });
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
