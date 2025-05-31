export interface Horse {
  name: string;
  speed: number;
  stamina: number;
  power: number;
}

export interface Betting {
  discordId: string;
  raceId: string;
  horseId: string;
  amount: number;
}
