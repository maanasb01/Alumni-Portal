import NextAuth, { DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./lib/db";
import authConfig from "./auth.config";
import { getUserById } from "./data/user";
import { SessionUser } from "./types/user";

declare module "next-auth" {
  interface Session {
    user: SessionUser;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        const user = await getUserById(token.sub);
        // session.user.id = token.sub;
        if (user) {
          session.user = user;
        }
      }

      return session;
    },
  },
  session: { strategy: "jwt" },
  ...authConfig,
});
