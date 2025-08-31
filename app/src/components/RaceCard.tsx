import Link from "next/link";

type Race = {
  raceId: number;
  state: string;
  startedAt?: string | null;
  stoppedAt?: string | null;
  settled: boolean;
  createdAt: string;
  updatedAt: string;
};

interface RaceCardProps {
  race: Race | null;
}

function fmt(dt?: string | null) {
  if (!dt) {
    return "-";
  }
  const d = new Date(dt);
  return d.toLocaleString();
}

export default function RaceCard({ race }: RaceCardProps) {
  return (
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
        <p className="text-sm text-red-600 dark:text-red-400">No race data.</p>
      )}
    </section>
  );
}
