import { DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: DefaultUser & {
      id: string;
      /** GitHub username; used for admin authorization allowlist checks. */
      githubLogin?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    githubLogin?: string;
  }
}
