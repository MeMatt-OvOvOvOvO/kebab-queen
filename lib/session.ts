import { cookies } from "next/headers";

const COOKIE_NAME = "kq_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 dni

export async function getSession(): Promise<{ userId: string } | null> {
  const store = await cookies();
  const value = store.get(COOKIE_NAME)?.value;
  if (!value) return null;
  return { userId: value };
}

export async function createSession(userId: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, userId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function deleteSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
