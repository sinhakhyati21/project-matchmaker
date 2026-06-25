import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { connectDB } from "./lib/db";
import User from "./models/User.model";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
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
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await connectDB();
        const githubProfile = profile as {
          login?: string;
          bio?: string;
          html_url?: string;
        };

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
        } catch {
          session.user.id = token.sub!;
        }
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
});