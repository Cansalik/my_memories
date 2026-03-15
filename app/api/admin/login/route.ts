import { NextResponse } from "next/server";
import { checkAdminPin, setAdminCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const { pin } = await req.json();
  if (!checkAdminPin(pin)) {
    return NextResponse.json({ error: "Hatalı şifre" }, { status: 401 });
  }
  setAdminCookie();
  return NextResponse.json({ ok: true });
}
