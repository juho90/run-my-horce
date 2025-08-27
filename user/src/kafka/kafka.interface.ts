export interface ItemAdd {
  userId: string;
  itemId: string;
  amount: number;
}

export interface ItemSub {
  userId: string;
  itemId: string;
  amount: number;
}

export interface Betting {
  userId: string;
  raceId: number;
  horseId: number;
  amount: number;
}
