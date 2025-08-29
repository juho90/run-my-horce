import { HorseEntity } from 'src/horse/entities/horse.entity';

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

export interface RaceHorse {
  raceId: number;
  horseId: number;
  name: string;
  runningStyle: HorseEntity['runningStyle'];
  strength: number;
  endurance: number;
  agility: number;
  intelligence: number;
  spirit: number;
  status: HorseEntity['status'];
}

export interface RaceLog {
  raceId: number;
}

export interface RaceResult {
  raceId: number;
  winnerHorseId: number;
  ranking: number[];
}
