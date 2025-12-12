import bcrypt from "bcrypt";

import { prisma } from "./prisma";

interface SeedUserInput {
  name: string;
  username: string;
  password: string;
  position: string;
}

export const seedUser = async (input: SeedUserInput) => {
  const salt = await bcrypt.genSalt(10);

  return prisma.user.create({
    data: {
      name: input.name,
      username: input.username,
      password: await bcrypt.hash(input.password, salt),
      position: input.position,
    },
  });
};
