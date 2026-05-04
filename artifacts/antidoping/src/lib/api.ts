const BASE = `${import.meta.env.BASE_URL}api`.replace(/\/+/g, "/").replace(/\/$/, "");

function getToken() {
  return localStorage.getItem("cs_token");
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(options.headers ?? {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Request failed");
  return data;
}

export async function register(name: string, email: string, password: string, role: string) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, role }),
  });
}

export async function login(email: string, password: string) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
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

export function saveAuth(token: string, user: { id: number; name: string; email: string; role: string }) {
  localStorage.setItem("cs_token", token);
  localStorage.setItem("cs_user", JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem("cs_token");
  localStorage.removeItem("cs_user");
}

export function getSavedUser() {
  const u = localStorage.getItem("cs_user");
  return u ? JSON.parse(u) : null;
}
