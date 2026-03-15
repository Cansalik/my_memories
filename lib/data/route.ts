import { NextResponse } from "next/server";
import { getSong } from "@/lib/data/song";
import { seedSong } from "@/lib/data/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  const song = await getSong();
  return NextResponse.json(song ?? seedSong, {
    headers: { "Cache-Control": "no-store" },
  });
}
