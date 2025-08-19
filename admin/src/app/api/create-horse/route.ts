import { producer } from "@/lib/kafka/producer";
import { KAFKA_TOPICS } from "@/lib/kafka/topic";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    await producer.connect();
    await producer.send({
      topic: KAFKA_TOPICS.CREATE_HORSE,
      messages: [{ value: body }],
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Kafka error:", e);
    return NextResponse.json(
      { ok: false, error: "Kafka send failed" },
      { status: 500 }
    );
  }
}
