import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { connectDB } from "./lib/db";
import User from "./models/User.model";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          scope: "read:user user:email repo",
        },
      },
    }),
  ],

  pages: {
    signIn: "/signin",
    error: "/signin",
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await connectDB();

        const githubProfile = profile as {
          login?: string;
          bio?: string;
          html_url?: string;
        };

        if (!user.email) return false;

        await User.findOneAndUpdate(
          { email: user.email },
          {
            name: user.name,
            email: user.email,
            image: user.image,
            githubUsername: githubProfile.login,
            githubBio: githubProfile.bio,
            githubUrl: githubProfile.html_url,
            githubAccessToken: account?.access_token,
          },
          { upsert: true, new: true }
        );

        return true;
      } catch (error) {
        console.error("Error saving GitHub user:", error);
        return false;
      }
    },

    async jwt({ token }) {
      try {
        await connectDB();

        if (token.email) {
          const dbUser = await User.findOne({ email: token.email });

          if (dbUser) {
            token.id = dbUser._id.toString();
            token.githubUsername = dbUser.githubUsername;
          }
        }
      } catch (error) {
        console.error("JWT callback error:", error);
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.githubUsername = token.githubUsername as string;
      }

      return session;
    },
  },
});