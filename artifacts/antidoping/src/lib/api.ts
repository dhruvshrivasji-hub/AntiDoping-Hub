const BASE = `${import.meta.env.BASE_URL}api`.replace(/\/+/g, "/").replace(/\/$/, "");

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
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
