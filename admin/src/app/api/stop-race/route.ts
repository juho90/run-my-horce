import { producer } from "@/lib/kafka/producer";
import { KAFKA_TOPICS } from "@/lib/kafka/topic";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await producer.connect();
    await producer.send({
      topic: KAFKA_TOPICS.STOP_RACE,
      messages: [{ value: JSON.stringify({}) }],
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
