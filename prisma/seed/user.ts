import bcrypt from "bcrypt";

import { prisma } from "./prisma";

export const seedUsers = async () => {
  const salt = await bcrypt.genSalt(10);
  return await prisma.user.createMany({
    data: {
      name: "Mohsen Karbaschi",
      username: "mk@123",
      password: await bcrypt.hash("test", salt),
      position: "CEO",
    },
  });
};
