import { NextResponse } from "next/server";

const CORE_API = process.env.CORE_API || "http://localhost:8000/api";

export async function GET() {
  try {
    const res = await fetch(`${CORE_API}/race/latest`);
    const text = await res.text();
    if (text) {
      return NextResponse.json(JSON.parse(text));
    } else {
      return NextResponse.json(null);
    }
  } catch (e) {
    console.error("API error:", e);
    return NextResponse.json(
      { ok: false, error: "API failed" },
      { status: 500 }
    );
  }
}
