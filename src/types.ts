// GAMES

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

// USERS & AUTH

interface BaseUser {
  username: string;
}

export interface LoggedUser extends BaseUser {
  token: string;
}

export interface LoggingUser extends BaseUser {
  loggingIn: true;
}

// REDUX

export interface State {
  games: GamesState;
  user: User;
}

export interface GamesState {
  allGames: SelectableGame[];
  activeGame: ActiveGame | null;
}

export type User = LoggedUser | LoggingUser | null;

export enum ActionType {
  // game actions
  INIT_GAMES = 'INIT_GAMES',
  ADD_GAME = 'ADD_GAME',
  DELETE_GAME = 'DELETE_GAME',
  LAUNCH_GAME = 'LAUNCH_GAME',
  UPDATE_ACTIVE_GAME = 'UPDATE_ACTIVE_GAME',
  // user actions
  LOGIN_REQUEST = 'LOGIN_REQUEST',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  LOGOUT = 'LOGOUT',
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
    }
  | {
      type: ActionType.LOGIN_REQUEST;
      payload: string; // username
    }
  | {
      type: ActionType.LOGIN_SUCCESS;
      payload: LoggedUser;
    }
  | {
      type: ActionType.LOGIN_FAILURE;
    }
  | {
      type: ActionType.LOGOUT;
    };
