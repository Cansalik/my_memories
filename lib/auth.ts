import { cookies } from "next/headers";
import { ADMIN_COOKIE, ADMIN_SESSION_HOURS } from "./constants";

const ADMIN_PIN = process.env.ADMIN_PIN ?? "1234";

export function checkAdminPin(pin: string): boolean {
  return pin === ADMIN_PIN;
}

export function setAdminCookie() {
  const cookieStore = cookies();
  cookieStore.set(ADMIN_COOKIE, "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: ADMIN_SESSION_HOURS * 60 * 60,
    path: "/",
  });
}

export function clearAdminCookie() {
  const cookieStore = cookies();
  cookieStore.delete(ADMIN_COOKIE);
}

export function isAdminAuthenticated(): boolean {
  const cookieStore = cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === "authenticated";
}
