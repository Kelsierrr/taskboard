// lib/api.ts
const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const MOCK = process.env.NEXT_PUBLIC_MOCK === "true";

type Method = "GET" | "POST" | "PATCH" | "DELETE";

export async function api<T>(
  path: string,
  opts?: { method?: Method; body?: any; token?: string }
): Promise<T> {
  if (MOCK) {
    return mockFetch<T>(path, { method: opts?.method, body: opts?.body });
  }

  const res = await fetch(`${BASE}${path}`, {
    method: opts?.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(opts?.token ? { Authorization: `Bearer ${opts.token}` } : {})
    },
    body: opts?.body ? JSON.stringify(opts.body) : undefined,
    credentials: "include"
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// --- mock mode (frontend-only fixtures) ---
async function mockFetch<T>(
  path: string,
  opts?: { method?: string; body?: any }
): Promise<T> {
  await new Promise((r) => setTimeout(r, 300));

  if (path === "/auth/login" && opts?.method === "POST") {
    const { email } = opts.body ?? {};
    // @ts-expect-error mock shape
    return { token: "mock-token", user: { id: "u1", name: "Mock User", email, roles: ["admin"] } };
  }

  if (path === "/auth/register" && opts?.method === "POST") {
    const { name, email } = opts.body ?? {};
    // @ts-expect-error mock shape
    return { token: "mock-token", user: { id: "u2", name, email, roles: ["member"] } };
  }

  if (path === "/me") {
    // @ts-expect-error mock shape
    return { id: "u1", name: "Mock User", email: "mock@taskboard.com", roles: ["admin"] };
  }

  // @ts-expect-error generic ok
  return { ok: true };
}
