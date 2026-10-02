const AUTH_PATH_PREFIXES = ["/auth", "/otp", "/phone"];

export const DEFAULT_POST_LOGIN_PATH = "/profile";

export function resolvePostLoginPath(raw: string | null | undefined): string {
  if (!raw) return DEFAULT_POST_LOGIN_PATH;
  if (!raw.startsWith("/") || raw.startsWith("//")) return DEFAULT_POST_LOGIN_PATH;
  if (AUTH_PATH_PREFIXES.some((prefix) => raw === prefix || raw.startsWith(`${prefix}/`) || raw.startsWith(`${prefix}?`))) {
    return DEFAULT_POST_LOGIN_PATH;
  }
  return raw;
}
