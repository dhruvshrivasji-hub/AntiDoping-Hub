const BASE = `${import.meta.env.BASE_URL}api`.replace(/\/+/g, "/").replace(/\/$/, "");

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

export interface UserProfile {
  id: number;
  clerkId: string;
  name: string;
  email: string;
  role: string;
  username: string | null;
  bio: string;
  sport: string;
  country: string;
  avatarColor: string;
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

export async function getMyProfile(): Promise<UserProfile | null> {
  try {
    const raw = await request("/users/me");
    return {
      id: raw.id,
      clerkId: raw.clerk_id,
      name: raw.name,
      email: raw.email,
      role: raw.role,
      username: raw.username ?? null,
      bio: raw.bio ?? "",
      sport: raw.sport ?? "",
      country: raw.country ?? "",
      avatarColor: raw.avatar_color ?? "#DC2626",
    };
  } catch {
    return null;
  }
}

export interface UpdateProfilePayload {
  username: string;
  bio: string;
  sport: string;
  country: string;
  avatarColor: string;
}

export async function updateProfile(payload: UpdateProfilePayload) {
  const raw = await request("/users/profile", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return {
    id: raw.id,
    clerkId: raw.clerk_id,
    name: raw.name,
    email: raw.email,
    role: raw.role,
    username: raw.username ?? null,
    bio: raw.bio ?? "",
    sport: raw.sport ?? "",
    country: raw.country ?? "",
    avatarColor: raw.avatar_color ?? "#DC2626",
  } as UserProfile;
}

export async function checkUsername(username: string): Promise<{ available: boolean }> {
  return request(`/users/check-username/${encodeURIComponent(username)}`);
}

export interface PublicProfile {
  id: number;
  name: string;
  username: string;
  role: string;
  bio: string;
  sport: string;
  country: string;
  avatarColor: string;
  completedCount: number;
  totalModules: number;
  avgScore: number;
  rank: number;
  modules: { slug: string; score: number; completed: boolean }[];
}

export async function getPublicProfile(username: string): Promise<PublicProfile> {
  return request(`/users/profile/${encodeURIComponent(username)}`);
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
