import { NextRequest, NextResponse } from "next/server";

const CORE_API = process.env.CORE_API || "http://localhost:8000/api";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const raceId = searchParams.get("raceId");
  if (!raceId) {
    return NextResponse.json(
      { ok: false, error: "raceId is required" },
      { status: 400 }
    );
  }
  try {
    const res = await fetch(`${CORE_API}/race-result?raceId=${raceId}`);
    const text = await res.text();
    if (text) {
      return NextResponse.json(JSON.parse(text));
    } else {
      return NextResponse.json(null);
    }
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: "API failed" },
      { status: 500 }
    );
  }
}
