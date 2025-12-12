import type { DefaultSession, NextAuthOptions, Session } from "next-auth";
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
          name: token.name,
          username: token.username,
          position: token.position,
          image: token.picture,
          accessToken: jwt.sign(token.sub ?? "", env.NEXTAUTH_SECRET),
        },
      };
    },
    async jwt({ token, user, trigger, session }) {
      if (typeof user !== "undefined") {
        token.username = user.username;
        token.position = user.position;
        token.name = user.name;
        token.picture = user.image;
      }
      const _session = session as Session | undefined;
      if (trigger === "update" && _session?.user) {
        if (_session.user.name !== undefined) token.name = _session.user.name;
        if (_session.user.image !== undefined)
          token.picture = _session.user.image;
      }
      return token;
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
          select: {
            id: true,
            name: true,
            username: true,
            position: true,
            password: true,
            avatar: { select: { id: true } },
          },
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
          image: user.avatar ? `/api/attachments/${user.avatar.id}` : undefined,
        };
      },
    }),
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions);
