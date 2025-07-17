export interface Horse {
  name: string;
  speed: number;
  stamina: number;
  power: number;
}

export interface Betting {
  discordId: string;
  raceId: number;
  horseId: number;
  amount: number;
}

export interface RaceLog {
  raceId: number;
}

export interface RaceResult {
  raceId: number;
  winnerHorseId: number;
  ranking: number[];
}
