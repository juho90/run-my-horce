"use client";

import HorseCard from "@/components/HorseCard";
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

export default function RaceDetail() {
  const { raceId } = useParams<{ raceId: string }>();
  const [race, setRace] = useState<Race | null>(null);
  const [horses, setHorses] = useState<any[]>([]);

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
      setHorses(data as any[]);
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
        {horses.length === 0 ? (
          <p className="text-sm text-black/50 dark:text-white/50">No horses.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {horses.map((horse) => (
              <HorseCard key={horse.horseId} horse={horse} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
