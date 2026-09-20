import { NextResponse } from "next/server";
import { generatePlanAI } from "@/lib/ai";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const userId = typeof body.userId === "string" ? body.userId : "alex";
  const partnerId = typeof body.partnerId === "string" ? body.partnerId : "";
  if (!partnerId) {
    return NextResponse.json({ error: "missing partnerId" }, { status: 400 });
  }
  const exchange = await generatePlanAI(userId, partnerId);
  return NextResponse.json({ exchange });
}
