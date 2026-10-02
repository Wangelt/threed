const STORAGE_KEY = "threedus.accessToken";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(STORAGE_KEY);
}

export function setAccessToken(token: string) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(STORAGE_KEY, token);
}

export function clearAccessToken() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(STORAGE_KEY);
}

export async function persistClientSession(accessToken: string) {
  setAccessToken(accessToken);
  const response = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accessToken }),
  });
  if (!response.ok) {
    throw new Error("Could not save login session");
  }
}

export async function clearClientSession() {
  clearAccessToken();
  await fetch("/api/auth/logout", { method: "POST" }).catch(() => undefined);
}
