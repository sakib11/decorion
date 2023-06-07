import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../lib/prismadb";
import Credentials from "next-auth/providers/credentials";

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
        phone: { label: "phone", type: "text" },
        verificationCode: { label: "verificationCode", type: "text" },
      },

      authorize: async ({ verificationCode, phone }: any): Promise<any> => {
        console.log("dsfsdf", { verificationCode, phone });

        const user = await prisma.user.findFirst({
          where: {
            phone,
            otp: verificationCode,
          },
        });
        return user ? user : null;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }: any) => {
      if (user) {
        token.phone = user.phone;
        // token.accessToken = user.data.auth.token;
      }

      return token;
    },
    session: ({ session, token, user }: any) => {
      if (token) {
        console.log("token%o", token);
        session.user.phone = token.phone;
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
