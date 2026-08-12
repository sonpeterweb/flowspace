import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { AdminShell } from "@/components/admin/admin-shell";
import { env } from "@/env.mjs";
import { isAdminGithubLogin } from "@/lib/admin-allowlist";
import { auth } from "@/lib/auth";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin?callbackUrl=/admin");
  }

  // Authenticated (GitHub OAuth) but not authorized as admin
  if (!isAdminGithubLogin(session.user.githubLogin, env.ADMIN_GITHUB_LOGIN)) {
    redirect("/");
  }

  return <AdminShell userName={session.user.name}>{children}</AdminShell>;
}
