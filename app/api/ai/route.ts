import { NextResponse } from "next/server";
import { discoverSkills } from "@/lib/ai";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const answers: string[] = Array.isArray(body.answers) ? body.answers : [];
  const skills = await discoverSkills(answers);
  return NextResponse.json({ skills });
}
