export enum GameType {
  SANAKIERTO = 'Sanakierto',
}

export interface Game {
  id: string;
  type: GameType;
  startTime: Date;
  status: GameStatus;
}

export interface SanakiertoPlayer {
  id?: string;
  name: string;
  words: string[];
  points: number;
}

export interface Sanakierto extends Game {
  players: SanakiertoPlayer[];
  rounds: number;
}

export interface SanakiertoActive extends Sanakierto {
  round: number;
  turn: number;
}

export type SelectableGame = Sanakierto; // additional games here

export type ActiveGame = SanakiertoActive; // additional games here

export enum GameStatus {
  RUNNING = 'Running',
  WAITING = 'Waiting for players',
  UPCOMING = 'Upcoming',
  FINISHED = 'Finished',
}

// redux
export interface State {
  games: SelectableGame[];
  activeGame: ActiveGame | null;
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
      type: 'LAUNCH_GAME';
      payload: string; // game id
    }
  | {
      type: 'UPDATE_ACTIVE_GAME';
      payload: ActiveGame; // game id
    };
