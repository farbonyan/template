import readline from "readline";
import { z } from "zod";

import { prisma } from "./prisma";
import { seedUser } from "./user";

const ask = (q: string): Promise<string> =>
  new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(q, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });

const seedUserWithInput = async () => {
  const name = await ask("Name: ");
  const username = await ask("Username: ");
  const password = await ask("Password: ");
  const position = await ask("Position: ");

  const params = z.object({
    name: z.string().trim().min(1),
    username: z.string().trim().min(1),
    password: z.string().trim().min(1),
    position: z.string().trim().min(1),
  });

  await seedUser(params.parse({ name, username, password, position }));

  console.info("User seeded successfully.");
};

export const main = async () => {
  await seedUserWithInput();
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
