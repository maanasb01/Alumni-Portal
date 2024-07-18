import NextAuth, { DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./lib/db";
import authConfig from "./auth.config";
import { getUserById } from "./data/user";
import {
  Degree,
  EmploymentHistory,
  FamilyMember,
  Organization,
  Prisma,
  User,
} from "@prisma/client";

// Properties returned by the getUserById function
type UserSelectKeys =
  | "name"
  | "organization"
  | "id"
  | "degree"
  | "EmploymentHistory"
  | "email"
  | "image"
  | "createdAt"
  | "isRegistered"
  | "organizationId"
  | "phone"
  | "degreeId"
  | "FamilyMembers";

type SessionUser = User & {
  organization: Organization | null;
  degree: Degree | null;
  EmploymentHistory: EmploymentHistory[] | null;
  FamilyMembers: FamilyMember[] | null;
};

declare module "next-auth" {
  interface Session {
    user: Pick<SessionUser, UserSelectKeys>;
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
