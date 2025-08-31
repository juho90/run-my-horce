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

interface HorseCardProps {
  horse: Horse;
}

export default function HorseCard({ horse }: HorseCardProps) {
  const totalStats =
    horse.strength +
    horse.endurance +
    horse.agility +
    horse.intelligence +
    horse.spirit;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "racing":
        return "text-green-600 dark:text-green-400";
      case "retired":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  return (
    <div className="rounded-lg border border-black/10 dark:border-white/15 p-4 bg-white dark:bg-black/20 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg">{horse.name}</h3>
          <div className="flex items-center gap-2 text-sm text-black/60 dark:text-white/50">
            <span>#{horse.number ?? "-"}</span>
            <span>•</span>
            <span className="uppercase tracking-wide">
              {horse.runningStyle}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div
            className={`text-sm font-medium capitalize ${getStatusColor(
              horse.status
            )}`}
          >
            {horse.status}
          </div>
          <div className="text-xs text-black/50 dark:text-white/40">
            ID: {horse.horseId}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">Strength</span>
          <span className="tabular-nums">{horse.strength}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-medium">Endurance</span>
          <span className="tabular-nums">{horse.endurance}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-medium">Agility</span>
          <span className="tabular-nums">{horse.agility}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-medium">Intelligence</span>
          <span className="tabular-nums">{horse.intelligence}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-medium">Spirit</span>
          <span className="tabular-nums">{horse.spirit}</span>
        </div>
        <div className="border-t border-black/10 dark:border-white/20 pt-2 mt-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Total</span>
            <span className="tabular-nums">{totalStats}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
