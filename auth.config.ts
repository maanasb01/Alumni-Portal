import { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./schemas/authSchema";
import { getUserByEmailForAuth } from "./data/user";
import bcrypt from "bcryptjs";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          const validatedData = LoginSchema.safeParse(credentials);

          if (validatedData.success) {
            const { email, password } = validatedData.data;
            const user = await getUserByEmailForAuth(email);
            // User still exists and might not have password if created account using oAuth providers like Google,
            // In that case, we dont want to authenticate the user with credentials provider.
            if (!user || !user.password) return null;

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) return user;
          }

          return null;
        } catch (error) {
          throw error;
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
