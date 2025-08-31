import { NextRequest, NextResponse } from "next/server";

const CORE_API = process.env.CORE_API;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const offset = searchParams.get("offset") || "0";
    const count = searchParams.get("count") || "10";

    const [racesRes, countRes] = await Promise.all([
      fetch(`${CORE_API}/races?offset=${offset}&count=${count}`, {
        cache: "no-store",
      }),
      fetch(`${CORE_API}/races-count`, { cache: "no-store" }),
    ]);

    if (!racesRes.ok || !countRes.ok) {
      return NextResponse.json({ error: "backend error" }, { status: 502 });
    }

    const [racesData, totalCount] = await Promise.all([
      racesRes.json(),
      countRes.json(),
    ]);

    return NextResponse.json(
      {
        races: racesData,
        total: totalCount,
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "fetch failed" },
      { status: 500 }
    );
  }
}
