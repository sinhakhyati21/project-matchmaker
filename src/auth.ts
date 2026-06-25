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
        if (!user.email) return true;
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
          { upsert: true, returnDocument: "after" }
        );
        return true;
      } catch (error) {
        console.error("Error saving user:", error);
        return true;
      }
    },

    async jwt({ token }) {
      try {
        await connectDB();
        if (token.email) {
          const dbUser = await User.findOne({ email: token.email });
          if (dbUser) {
            token.id = dbUser._id.toString();
          }
        }
      } catch (error) {
        console.error("JWT callback error:", error);
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});