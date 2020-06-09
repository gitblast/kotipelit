export type GameType = 'sanakierto';

export interface Game {
  id: string;
  type: GameType;
  startTime: Date;
  running: boolean;
}

export interface SanakiertoPlayer {
  name: string;
  words: string[];
}

export interface Sanakierto extends Game {
  players: SanakiertoPlayer[];
}

export type SelectableGame = Sanakierto; // additional games here

// redux
export interface State {
  games: SelectableGame[];
}

export type Action =
  | {
      type: 'INIT_GAMES';
      payload: SelectableGame[];
    }
  | {
      type: 'ADD_GAME';
      payload: SelectableGame;
    }
  | {
      type: 'DELETE_GAME';
      payload: string; // game id
    }
  | {
      type: 'START_GAME';
      payload: string; // game id
    };
