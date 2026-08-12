import { NextResponse } from "next/server";

import { env } from "@/env.mjs";
import { isAdminGithubLogin } from "@/lib/admin-allowlist";
import { auth } from "@/lib/auth";

/**
 * Returns the session only when the user is authenticated AND authorized
 * as an admin (GitHub login on ADMIN_GITHUB_LOGIN allowlist).
 */
export async function getAdminSession() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  if (!isAdminGithubLogin(session.user.githubLogin, env.ADMIN_GITHUB_LOGIN)) {
    return null;
  }

  return session;
}

export async function requireAdminSession() {
  const session = await auth();

  if (!session?.user) {
    return {
      session: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  // Authenticated but not on the admin allowlist
  if (!isAdminGithubLogin(session.user.githubLogin, env.ADMIN_GITHUB_LOGIN)) {
    return {
      session: null,
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { session, error: null };
}
