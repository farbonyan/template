import type { DefaultSession, NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth";
import { type Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";

import { env } from "~/env";
import { db } from "~/server/db";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      username: string;
      position: string;
      accessToken: string;
    } & DefaultSession["user"];
  }

  interface User {
    name: string;
    username: string;
    position: string;
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          username: token.username,
          position: token.position,
          accessToken: jwt.sign(token.sub ?? "", env.NEXTAUTH_SECRET),
        },
      };
    },
    jwt: ({ token, user }) => {
      if (typeof user === "undefined") return token;
      return {
        ...token,
        username: user.username,
        position: user.position,
      };
    },
  },
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(db) as Adapter,
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      type: "credentials",
      id: "credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "Enter your username",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      authorize: async (credentials) => {
        if (!credentials) return null;

        const user = await db.user.findFirst({
          where: {
            username: {
              equals: credentials.username,
            },
            deletedAt: null,
          },
        });

        if (!user) return null;

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isPasswordCorrect) return null;

        return {
          id: user.id,
          name: user.name,
          username: user.username,
          position: user.position,
        };
      },
    }),
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions);
