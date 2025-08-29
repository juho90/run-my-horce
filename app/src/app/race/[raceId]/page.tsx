"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Race {
  raceId: number;
  state: string;
  startedAt?: string | null;
  stoppedAt?: string | null;
  settled: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Horse {
  raceId: number;
  horseId: number;
  name: string;
  runningStyle: string;
  strength: number;
  endurance: number;
  agility: number;
  intelligence: number;
  spirit: number;
  status: "idle" | "racing" | "retired";
  number?: number;
}

export default function RaceDetail() {
  const { raceId } = useParams<{ raceId: string }>();
  const [race, setRace] = useState<Race | null>(null);
  const [horses, setHorses] = useState<Horse[]>([]);

  const fetchRace = async () => {
    const res = await fetch(`/api/race/${raceId}`, { cache: "no-store" });
    if (!res.ok) {
      return;
    }
    const data = await res.json();
    if (data && data.raceId) {
      setRace(data as Race);
    }
  };

  const fetchHorses = async () => {
    const res = await fetch(`/api/horse/${raceId}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return;
    }
    const data = await res.json();
    if (Array.isArray(data)) {
      setHorses(data as Horse[]);
    }
  };

  useEffect(() => {
    fetchRace();
    fetchHorses();
  }, []);

  if (!race) {
    return (
      <div className="p-8 sm:p-16 font-sans">
        <p className="text-sm text-black/60 dark:text-white/50">
          Loading race...
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 sm:p-16 space-y-10 font-sans">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Race #{race.raceId}</h1>
        <p className="text-sm text-black/60 dark:text-white/50">
          State: <span className="uppercase font-medium">{race.state}</span>
        </p>
        <Link
          href="/"
          className="text-blue-600 dark:text-blue-400 text-sm underline"
        >
          Back
        </Link>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">Horses</h2>
        {horses.length === 0 && (
          <p className="text-sm text-black/50 dark:text-white/50">No horses.</p>
        )}
        {horses.length > 0 && (
          <table className="w-full text-sm border-collapse overflow-x-auto">
            <thead>
              <tr className="text-left border-b border-black/10 dark:border-white/20">
                <th className="py-2 pr-4">#</th>
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Style</th>
                <th className="py-2 pr-4">STR</th>
                <th className="py-2 pr-4">END</th>
                <th className="py-2 pr-4">AGI</th>
                <th className="py-2 pr-4">INT</th>
                <th className="py-2 pr-4">SPIRIT</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">ID</th>
              </tr>
            </thead>
            <tbody>
              {horses.map((h) => (
                <tr
                  key={h.horseId}
                  className="border-b border-black/5 dark:border-white/10"
                >
                  <td className="py-1 pr-4 tabular-nums">{h.number ?? "-"}</td>
                  <td className="py-1 pr-4 font-medium">{h.name}</td>
                  <td className="py-1 pr-4 text-xs uppercase tracking-wide">
                    {h.runningStyle}
                  </td>
                  <td className="py-1 pr-4 tabular-nums">{h.strength}</td>
                  <td className="py-1 pr-4 tabular-nums">{h.endurance}</td>
                  <td className="py-1 pr-4 tabular-nums">{h.agility}</td>
                  <td className="py-1 pr-4 tabular-nums">{h.intelligence}</td>
                  <td className="py-1 pr-4 tabular-nums">{h.spirit}</td>
                  <td className="py-1 pr-4 text-xs capitalize">{h.status}</td>
                  <td className="py-1 pr-4 text-black/60 dark:text-white/50">
                    {h.horseId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
