import { type NextRequest, NextResponse } from "next/server";

import { getAdminSession } from "@/lib/admin-auth";
import { createPreviewRedirect } from "@/lib/sanity/preview-server";

/**
 * Authenticated + authorized preview entry for admins — no secret in the URL.
 *
 * Usage: /api/admin/preview?slug=blog/my-post
 */
export async function GET(request: NextRequest) {
  const session = await getAdminSession();

  if (!session?.user) {
    const signInUrl = new URL("/api/auth/signin", request.url);
    signInUrl.searchParams.set(
      "callbackUrl",
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
    );
    return NextResponse.redirect(signInUrl);
  }

  const slug = request.nextUrl.searchParams.get("slug");
  return createPreviewRedirect(request, slug);
}
