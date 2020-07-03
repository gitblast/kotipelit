// GAMES

export enum GameType {
  SANAKIERTO = 'sanakierto',
}

export interface Game {
  id: string;
  type: GameType;
  startTime: Date;
  status: GameStatus;
}

export interface SanakiertoPlayer {
  id: string;
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
  loggedIn: false;
}

export interface LoggedUser {
  username: string;
  loggedIn: true;
  token: string;
}

export interface LoggingUser extends BaseUser {
  username: string;
}

export interface HostChannel extends BaseUser {
  channelName: string;
}

// REDUX

export interface State {
  games: GamesState;
  user: User;
  channels: ChannelsState;
}

export interface GamesState {
  allGames: SelectableGame[];
  activeGame: ActiveGame | null;
  loading: boolean;
}

export interface ChannelsState {
  allChannels: HostChannel[];
  loading: boolean;
}

export type User = LoggedUser | LoggingUser | BaseUser;

export enum ActionType {
  // GAME ACTIONS

  // init games
  INIT_GAMES_REQUEST = 'INIT_GAMES_REQUEST',
  INIT_GAMES_SUCCESS = 'INIT_GAMES_SUCCESS',
  INIT_GAMES_FAILURE = 'INIT_GAMES_FAILURE',

  // add game
  ADD_GAME_REQUEST = 'ADD_GAME_REQUEST',
  ADD_GAME_SUCCESS = 'ADD_GAME_SUCCESS',
  ADD_GAME_FAILURE = 'ADD_GAME_FAILURE',

  // delete game
  DELETE_GAME_REQUEST = 'DELETE_GAME_REQUEST',
  DELETE_GAME_SUCCESS = 'DELETE_GAME_SUCCESS',
  DELETE_GAME_FAILURE = 'DELETE_GAME_FAILURE',

  LAUNCH_GAME = 'LAUNCH_GAME',
  UPDATE_ACTIVE_GAME = 'UPDATE_ACTIVE_GAME',

  // USER ACTIONS

  // login & logout
  LOGIN_REQUEST = 'LOGIN_REQUEST',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  LOGOUT = 'LOGOUT',

  // init channels
  INIT_CHANNELS_REQUEST = 'INIT_CHANNELS_REQUEST',
  INIT_CHANNELS_SUCCESS = 'INIT_CHANNELS_SUCCESS',
  INIT_CHANNELS_FAILURE = 'INIT_CHANNELS_FAILURE',
}

export type Action =
  // INIT GAMES
  | {
      type: ActionType.INIT_GAMES_REQUEST;
    }
  | {
      type: ActionType.INIT_GAMES_SUCCESS;
      payload: SelectableGame[];
    }
  | {
      type: ActionType.INIT_GAMES_FAILURE;
    }

  // ADD GAME
  | {
      type: ActionType.ADD_GAME_REQUEST;
    }
  | {
      type: ActionType.ADD_GAME_SUCCESS;
      payload: SelectableGame;
    }
  | {
      type: ActionType.ADD_GAME_FAILURE;
    }

  // DELETE GAME
  | {
      type: ActionType.DELETE_GAME_REQUEST;
    }
  | {
      type: ActionType.DELETE_GAME_SUCCESS;
      payload: string; // game id
    }
  | {
      type: ActionType.DELETE_GAME_FAILURE;
    }

  // LAUNCH GAME
  | {
      type: ActionType.LAUNCH_GAME;
      payload: string; // game id
    }
  | {
      type: ActionType.UPDATE_ACTIVE_GAME;
      payload: ActiveGame; // game id
    }

  // INIT CHANNELS
  | {
      type: ActionType.INIT_CHANNELS_REQUEST;
    }
  | {
      type: ActionType.INIT_CHANNELS_SUCCESS;
      payload: HostChannel[];
    }
  | {
      type: ActionType.INIT_CHANNELS_FAILURE;
    }

  // LOGIN & USER
  | {
      type: ActionType.LOGIN_REQUEST;
      payload: string; // username
    }
  | {
      type: ActionType.LOGIN_SUCCESS;
      payload: Omit<LoggedUser, 'loggedIn'>;
    }
  | {
      type: ActionType.LOGIN_FAILURE;
    }
  | {
      type: ActionType.LOGOUT;
    };

// SOCKET IO EVENTS

export enum PlayerEvent {
  JOIN_GAME = 'join game',

  JOIN_SUCCESS = 'join success',
  JOIN_FAILURE = 'join failure',

  GAME_READY = 'game ready',
  GAME_STARTING = 'game starting',
}

export enum HostEvent {
  CREATE_GAME = 'create game',

  CREATE_SUCCESS = 'create success',
  CREATE_FAILURE = 'create failure',
  START_SUCCESS = 'start success',
  START_FAILURE = 'start failure',
}

export enum CommonEvent {
  AUTH_REQUEST = 'authenticate',
  AUTHENTICATED = 'authenticated',
  UNAUTHORIZED = 'unauthorized',

  CONNECT = 'connect',
  PLAYER_JOINED = 'player joined',
}

export interface MockSocket {
  listeners: Record<string, Function>;
  emitted: Record<string, object>;
  on: Function;
  emit: Function;
}
