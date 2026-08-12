import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";

import { env } from "@/env.mjs";
import {
  getGithubLoginFromProfile,
  isAdminGithubLogin,
} from "@/lib/admin-allowlist";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    GitHubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
  ],
  // Note: Database adapter removed for Sanity integration
  // Session will use JWT by default
  callbacks: {
    /**
     * Authorization gate: authenticate via GitHub, then only allow allowlisted
     * usernames to create a session. Rejected users never receive a JWT.
     */
    async signIn({ profile }) {
      const githubLogin = getGithubLoginFromProfile(profile);
      return isAdminGithubLogin(githubLogin, env.ADMIN_GITHUB_LOGIN);
    },
    async jwt({ token, user, profile }) {
      if (user) {
        token.id = user.id || user.email || "";
      }

      const githubLogin = getGithubLoginFromProfile(profile);
      if (githubLogin) {
        token.githubLogin = githubLogin;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || token.sub || "";
        if (token.githubLogin) {
          session.user.githubLogin = token.githubLogin;
        }
      }
      return session;
    },
  },
});
