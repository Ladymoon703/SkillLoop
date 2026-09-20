import { NextResponse } from "next/server";
import { discoverLoop } from "@/lib/ai";

export async function GET() {
  const loop = await discoverLoop();
  return NextResponse.json({ loop });
}
