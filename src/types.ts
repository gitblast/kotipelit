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

export enum ActionType {
  INIT_GAMES = 'INIT_GAMES',
  ADD_GAME = 'ADD_GAME',
  DELETE_GAME = 'DELETE_GAME',
  LAUNCH_GAME = 'LAUNCH_GAME',
  UPDATE_ACTIVE_GAME = 'UPDATE_ACTIVE_GAME',
}

export type Action =
  | {
      type: ActionType.INIT_GAMES;
      payload: SelectableGame[];
    }
  | {
      type: ActionType.ADD_GAME;
      payload: SelectableGame;
    }
  | {
      type: ActionType.DELETE_GAME;
      payload: string; // game id
    }
  | {
      type: ActionType.LAUNCH_GAME;
      payload: string; // game id
    }
  | {
      type: ActionType.UPDATE_ACTIVE_GAME;
      payload: ActiveGame; // game id
    };
