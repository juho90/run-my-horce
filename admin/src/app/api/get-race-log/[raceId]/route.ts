import { NextRequest, NextResponse } from "next/server";

const CORE_API = process.env.CORE_API || "http://localhost:8000/api";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ raceId: string }> }
) {
  const { raceId } = await params;
  if (!raceId) {
    return NextResponse.json(
      { ok: false, error: "raceId is required" },
      { status: 400 }
    );
  }
  try {
    const res = await fetch(`${CORE_API}/race-log/${raceId}`);
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
