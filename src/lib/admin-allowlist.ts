/**
 * Normalize a GitHub login for case-insensitive allowlist checks.
 * GitHub usernames are case-insensitive.
 */
export function normalizeGithubLogin(login: string): string {
  return login.trim().toLowerCase();
}

/** Parse comma-separated `ADMIN_GITHUB_LOGIN` into a set of normalized logins. */
export function parseAdminGithubAllowlist(raw: string): ReadonlySet<string> {
  return new Set(raw.split(",").map(normalizeGithubLogin).filter(Boolean));
}

/**
 * Authorization check: is this GitHub login on the admin allowlist?
 * Separates authentication (GitHub OAuth succeeded) from authorization (allowed admin).
 */
export function isAdminGithubLogin(
  login: string | null | undefined,
  allowlistRaw: string,
): boolean {
  if (!login) return false;
  return parseAdminGithubAllowlist(allowlistRaw).has(
    normalizeGithubLogin(login),
  );
}

export function getGithubLoginFromProfile(
  profile: unknown,
): string | undefined {
  if (
    profile &&
    typeof profile === "object" &&
    "login" in profile &&
    typeof (profile as { login: unknown }).login === "string"
  ) {
    return (profile as { login: string }).login;
  }
  return undefined;
}
