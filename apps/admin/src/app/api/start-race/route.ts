import { producer } from "@lib/kafka/producer";
import { NextResponse } from "next/server";

export async function POST() {
  await producer.connect();
  await producer.send({
    topic: "horse.start-race",
    messages: [{ value: JSON.stringify({}) }],
  });
  return NextResponse.json({ ok: true });
}
