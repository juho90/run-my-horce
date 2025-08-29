import { NextResponse } from "next/server";

const CORE_API = process.env.CORE_API;

export async function GET() {
  try {
    const res = await fetch(`${CORE_API}/race/latest`, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json(
        { error: "backend error", status: res.status },
        { status: 502 }
      );
    }
    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "fetch failed" },
      { status: 500 }
    );
  }
}
