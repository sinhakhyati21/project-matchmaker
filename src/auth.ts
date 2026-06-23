import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

import { connectDB } from "./lib/db";
import User from "./models/User.model";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, profile }) {
      try {
        await connectDB();

        await User.findOneAndUpdate(
          {
            email: user.email,
          },
          {
            name: user.name,
            email: user.email,
            image: user.image,
            githubUsername: (profile as any)?.login,
          },
          {
            upsert: true,
            new: true,
          }
        );

        return true;
      } catch (error) {
        console.error("Error saving user:", error);
        return false;
      }
    },

    async session({ session, token }) {
      if (session.user) {
        try {
          await connectDB();
          const dbUser = await User.findOne({ email: session.user.email });
          if (dbUser) {
            session.user.id = dbUser._id.toString();
          } else {
            session.user.id = token.sub!;
          }
        } catch (error) {
          console.error("Error fetching user ID in session:", error);
          session.user.id = token.sub!;
        }
      }

      return session;
    },
  },

  secret: process.env.AUTH_SECRET,
});