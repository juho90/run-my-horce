import { producer } from "@/lib/kafka/producer";
import { KAFKA_TOPICS } from "@/lib/kafka/topic";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { raceId, winnerHorseId, ranking } = body;
    if (!raceId || !winnerHorseId || !ranking) {
      return NextResponse.json(
        { ok: false, error: "필수 값이 누락되었습니다." },
        { status: 400 }
      );
    }
    await producer.connect();
    await producer.send({
      topic: KAFKA_TOPICS.CREATE_RACE_RESULT,
      messages: [
        {
          value: JSON.stringify({ raceId, winnerHorseId, ranking }),
        },
      ],
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Kafka error:", e);
    return NextResponse.json(
      { ok: false, error: "Kafka publish failed" },
      { status: 500 }
    );
  }
}
