"use client";

import RaceCard from "@/components/RaceCard";
import Image from "next/image";
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

export default function Home() {
  const [race, setRace] = useState<Race | null>(null);
  const [races, setRaces] = useState<Race[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

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

  const fetchRaces = async (page: number) => {
    setLoading(true);
    const offset = (page - 1) * itemsPerPage;
    const res = await fetch(
      `/api/races?offset=${offset}&count=${itemsPerPage}`,
      { cache: "no-store" }
    );
    if (res.ok) {
      const data = await res.json();
      if (data.races && Array.isArray(data.races)) {
        setRaces(data.races as Race[]);
        setTotalCount(data.total || 0);
      }
    }
    setLoading(false);
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchRaces(page);
  };

  useEffect(() => {
    fetchLatestRace();
    fetchRaces(1);
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

      <RaceCard race={race} />

      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold tracking-tight">All Races</h2>
          <p className="text-sm text-black/60 dark:text-white/50">
            Total: {totalCount} races
          </p>
        </div>

        {loading ? (
          <p className="text-sm text-black/60 dark:text-white/50">
            Loading races...
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {races.map((raceItem) => (
              <RaceCard key={raceItem.raceId} race={raceItem} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black/5 dark:hover:bg-white/10"
            >
              Previous
            </button>

            <div className="flex gap-1">
              {(() => {
                const startPage = Math.max(1, currentPage - 2);
                const endPage = Math.min(totalPages, startPage + 4);
                const adjustedStartPage = Math.max(1, endPage - 4);

                const pages = [];
                for (let i = adjustedStartPage; i <= endPage; i++) {
                  pages.push(i);
                }

                return pages.map((pageNum) => (
                  <button
                    key={`page-${pageNum}`}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 text-sm border rounded ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white border-blue-600"
                        : "hover:bg-black/5 dark:hover:bg-white/10"
                    }`}
                  >
                    {pageNum}
                  </button>
                ));
              })()}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black/5 dark:hover:bg-white/10"
            >
              Next
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
