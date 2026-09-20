import { NextResponse } from "next/server";
import { coachFeedback } from "@/lib/ai";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const suggestions = await coachFeedback({
    goal: typeof body.goal === "string" ? body.goal : "",
    doneCount: Number(body.doneCount) || 0,
    totalCount: Number(body.totalCount) || 0,
    doneTitles: Array.isArray(body.doneTitles) ? body.doneTitles : [],
    todoTitles: Array.isArray(body.todoTitles) ? body.todoTitles : [],
    partnerName: typeof body.partnerName === "string" ? body.partnerName : "",
  });
  return NextResponse.json({ suggestions });
}
