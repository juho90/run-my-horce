"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Race = {
  raceId: number;
  state: string;
  startedAt?: string | null;
  stoppedAt?: string | null;
  settled: boolean;
  createdAt: string;
  updatedAt: string;
};

function fmt(dt?: string | null) {
  if (!dt) {
    return "-";
  }
  const d = new Date(dt);
  return d.toLocaleString();
}

export default function Home() {
  const [race, setRace] = useState<Race | null>(null);

  const fetchLatestRace = async () => {
    const res = await fetch("/api/race/latest", { cache: "no-store" });
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    if (data && data.raceId) {
      setRace(data as Race);
    }
  };

  useEffect(() => {
    fetchLatestRace();
  }, []);

  return (
    <div className="font-sans min-h-screen p-8 sm:p-16 flex flex-col gap-12">
      <header className="flex flex-col gap-4 items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={160}
          height={34}
          priority
        />
        <h1 className="text-2xl font-semibold tracking-tight">Latest Race</h1>
      </header>

      <section className="rounded-lg border border-black/10 dark:border-white/15 p-5 bg-white dark:bg-black/20 shadow-sm max-w-xl">
        {race ? (
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Race ID</span>
              <span>
                <Link
                  href={`/race/${race.raceId}`}
                  className="text-blue-600 dark:text-blue-400 underline"
                >
                  {race.raceId}
                </Link>
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">State</span>
              <span className="uppercase tracking-wide">{race.state}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Started</span>
              <span>{fmt(race.startedAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Stopped</span>
              <span>{fmt(race.stoppedAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Settled</span>
              <span>{race.settled ? "Yes" : "No"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Created</span>
              <span>{fmt(race.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Updated</span>
              <span>{fmt(race.updatedAt)}</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-red-600 dark:text-red-400">
            No race data.
          </p>
        )}
      </section>
    </div>
  );
}
