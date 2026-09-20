import { NextResponse } from "next/server";
import { matchPartners } from "@/lib/ai";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId") || "alex";
  const matches = await matchPartners(userId);
  return NextResponse.json({ matches });
}
