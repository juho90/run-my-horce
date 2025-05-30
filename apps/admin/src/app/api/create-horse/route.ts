import { producer } from "@/lib/kafka/producer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    await producer.connect();
    await producer.send({
      topic: "horse.create-horse",
      messages: [{ value: JSON.stringify(body) }],
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
