const BASE = `${import.meta.env.BASE_URL}api`.replace(/\/+/g, "/").replace(/\/$/, "");

// Set by AppRoutes once Clerk is loaded — provides a fresh JWT for every request
let _tokenGetter: (() => Promise<string | null>) | null = null;

export function setAuthTokenGetter(getter: () => Promise<string | null>) {
  _tokenGetter = getter;
}

async function request(path: string, options: RequestInit = {}) {
  const token = _tokenGetter ? await _tokenGetter() : null;

  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Request failed");
  return data;
}

export interface SyncUserPayload {
  clerkId: string;
  name: string;
  email: string;
  role: string;
}

export async function syncUser(payload: SyncUserPayload) {
  return request("/users/sync", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getUserRole(): Promise<{ role: string } | null> {
  return request("/users/me");
}

export async function getDashboard() {
  return request("/dashboard");
}

export async function completeModule(slug: string, score = 100) {
  return request(`/progress/${slug}`, {
    method: "POST",
    body: JSON.stringify({ score }),
  });
}

export async function getLeaderboard() {
  return request("/leaderboard");
}

export async function getProgress(): Promise<
  { slug: string; title: string; completed: boolean; score: number }[]
> {
  return request("/progress");
}
