export type GameType = 'sanakierto';

export interface Game {
  id: string;
  type: GameType;
  startTime: Date;
}

export interface SanakiertoPlayer {
  name: string;
  words: string[];
}

export interface Sanakierto extends Game {
  players: SanakiertoPlayer[];
}

export type SelectableGame = Sanakierto; // additional games here
