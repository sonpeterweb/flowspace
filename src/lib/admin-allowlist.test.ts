import {
  getGithubLoginFromProfile,
  isAdminGithubLogin,
  normalizeGithubLogin,
  parseAdminGithubAllowlist,
} from "./admin-allowlist";

describe("admin-allowlist", () => {
  describe("normalizeGithubLogin", () => {
    it("trims and lowercases", () => {
      expect(normalizeGithubLogin("  SonPeterWeb  ")).toBe("sonpeterweb");
    });
  });

  describe("parseAdminGithubAllowlist", () => {
    it("parses a single login", () => {
      expect([...parseAdminGithubAllowlist("sonpeterweb")]).toEqual([
        "sonpeterweb",
      ]);
    });

    it("parses comma-separated logins and ignores blanks", () => {
      expect([...parseAdminGithubAllowlist("alice, Bob,  ,carol ")]).toEqual([
        "alice",
        "bob",
        "carol",
      ]);
    });
  });

  describe("isAdminGithubLogin", () => {
    it("allows matching login case-insensitively", () => {
      expect(isAdminGithubLogin("SonPeterWeb", "sonpeterweb")).toBe(true);
    });

    it("allows any login in a multi-admin allowlist", () => {
      expect(isAdminGithubLogin("bob", "alice,bob")).toBe(true);
    });

    it("rejects unknown logins", () => {
      expect(isAdminGithubLogin("intruder", "sonpeterweb")).toBe(false);
    });

    it("rejects missing login", () => {
      expect(isAdminGithubLogin(undefined, "sonpeterweb")).toBe(false);
      expect(isAdminGithubLogin("", "sonpeterweb")).toBe(false);
    });
  });

  describe("getGithubLoginFromProfile", () => {
    it("reads login from GitHub profile", () => {
      expect(getGithubLoginFromProfile({ login: "sonpeterweb" })).toBe(
        "sonpeterweb",
      );
    });

    it("returns undefined for invalid profiles", () => {
      expect(getGithubLoginFromProfile(null)).toBeUndefined();
      expect(getGithubLoginFromProfile({})).toBeUndefined();
      expect(getGithubLoginFromProfile({ login: 123 })).toBeUndefined();
    });
  });
});
