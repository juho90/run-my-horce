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
    // core 서버에서 해당 레이스의 베팅 목록 조회
    const res = await fetch(`${CORE_API}/bets/${raceId}`);
    if (!res.ok) {
      throw new Error("Core API error");
    }
    const bets = await res.json();
    // horseId별로 금액 합산
    const summaryMap: Record<number, number> = {};
    for (const bet of bets) {
      const horseId = Number(bet.horseId);
      const amount = Number(bet.amount);
      if (!summaryMap[horseId]) {
        summaryMap[horseId] = 0;
      }
      summaryMap[horseId] += amount;
    }
    // summary 배열로 변환
    const summary = Object.entries(summaryMap).map(
      ([horseId, totalAmount]) => ({
        horseId: Number(horseId),
        totalAmount: Number(totalAmount),
      })
    );
    return NextResponse.json(summary);
  } catch (e) {
    console.error("API error:", e);
    return NextResponse.json(
      { ok: false, error: "API failed" },
      { status: 500 }
    );
  }
}
