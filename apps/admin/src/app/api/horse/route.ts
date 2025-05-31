import { NextResponse } from "next/server";

const CORE_API = process.env.CORE_API || "http://localhost:8000";

export async function GET() {
  const res = await fetch(`${CORE_API}/horses`);
  const data = await res.json();
  return NextResponse.json(data);
}
