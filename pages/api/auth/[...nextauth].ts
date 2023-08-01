import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../lib/prismadb";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

async function comparePassword(plaintextPassword: string, hash: string) {
  return await bcrypt.compare(plaintextPassword, hash);
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),

    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },

      authorize: async ({ email, password }: any): Promise<any> => {
        console.log("11111", { email, password });

        const user = await prisma.user.findFirst({
          where: {
            email,
          },
        });

        if (!user) {
          return null;
        }

        if (
          (await comparePassword(
            password,
            user.password ? user.password : ""
          )) === false
        ) {
          return null;
        }
        return user;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }: any) => {
      if (user) {
        token.email = user.email;
        // token.accessToken = user.data.auth.token;
      }

      return token;
    },
    session: ({ session, token, user }: any) => {
      if (token) {
        console.log("token%o", token);
        session.user.email = token.email;
        session.user.accessToken = token.accessToken;
      }
      return session;
    },
  },
  // pages: {
  //   error: "/auth/signin",
  // },
};

export default NextAuth({
  ...authOptions,
});
