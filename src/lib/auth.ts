import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "./dbConnect";
import User from "@/models/user.model";
import { validateUser } from "@/actions/validateUser";

export interface UserTypes {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  authProviderId?: string;
  authProviderName?: string;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      authProviderId?: string;
      authProviderName?: string;
    };
  }
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await validateUser(credentials);
        if (!user) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          authProviderId: (user as UserTypes).authProviderId,
          authProviderName: (user as UserTypes).authProviderName,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = (user as UserTypes).role;
        token.authProviderId = (user as UserTypes).authProviderId;
        token.authProviderName = (user as UserTypes).authProviderName;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string;
        session.user.authProviderId = token.authProviderId as string;
        session.user.authProviderName = token.authProviderName as string;
      }
      return session;
    },

    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const { email, name, id } = user;
          await dbConnect();
          const existingUser = await User.findOneAndUpdate(
            { email },
            { userName: name, authProviderId: id, authProviderName: "google" },
            { upsert: true, new: true }
          );

          user.id = existingUser?._id;
          (user as UserTypes).authProviderId = existingUser?.authProviderId;
          (user as UserTypes).authProviderName = existingUser?.authProviderName;
          (user as UserTypes).role = existingUser?.role;
          return true;
        } catch (error) {
          console.error("Google sign-in error:", error);
          throw new Error("Error while processing Google sign-in");
        }
      }

      if (account?.provider === "credentials") {
        return true;
      }
      return false;
    },
  },

  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  secret: process.env.AUTH_SECRET!,
};
