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
  online: boolean;
}

export interface Sanakierto extends Game {
  players: SanakiertoPlayer[];
  rounds: number;
}

export interface SanakiertoActive extends Sanakierto {
  info: {
    turn: string; // player id
    round: number;
  };
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

export interface BaseUser {
  loggedIn: false;
  socket: null | SocketIOClient.Socket;
  jitsiRoom: null | string;
}

export interface LoggedUser {
  username: string;
  loggedIn: true;
  token: string;
  jitsiToken: string | null;
  socket: null | SocketIOClient.Socket;
  jitsiRoom: null | string;
}

export interface LoggingUser extends BaseUser {
  username: string;
}

export interface HostChannel {
  username: string;
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

  SET_ACTIVE_GAME = 'SET_ACTIVE_GAME',

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

  // user handling
  SET_JITSI_TOKEN = 'SET_JITSI_TOKEN',
  SET_JITSI_ROOM = 'SET_JITSI_ROOM',
  SET_SOCKET = 'SET_SOCKET',

  // init channels
  INIT_CHANNELS_REQUEST = 'INIT_CHANNELS_REQUEST',
  INIT_CHANNELS_SUCCESS = 'INIT_CHANNELS_SUCCESS',
  INIT_CHANNELS_FAILURE = 'INIT_CHANNELS_FAILURE',
}

export type Action =
  | {
      type: ActionType.SET_ACTIVE_GAME;
      payload: ActiveGame;
    }
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
      payload: Pick<LoggedUser, 'username' | 'token'>;
    }
  | {
      type: ActionType.LOGIN_FAILURE;
    }
  | {
      type: ActionType.LOGOUT;
    }
  | {
      type: ActionType.SET_JITSI_TOKEN;
      payload: string; // jitsi token
    }
  | {
      type: ActionType.SET_JITSI_ROOM;
      payload: string; // jitsi room
    }
  | {
      type: ActionType.SET_SOCKET;
      payload: SocketIOClient.Socket;
    };

// SOCKET IO EVENTS

export interface CreateSuccessResponse {
  game: ActiveGame;
  jitsiToken: string;
}

export interface JoinSuccessResponse {
  game: ActiveGame;
  jitsiRoom: string;
}

export enum PlayerEvent {
  JOIN_GAME = 'join game',

  JOIN_SUCCESS = 'join success',
  JOIN_FAILURE = 'join failure',

  GAME_READY = 'game ready',
  GAME_STARTING = 'game starting',
  GAME_UPDATED = 'game updated',
}

export enum HostEvent {
  JITSI_READY = 'jitsi ready',
  CREATE_ROOM = 'create room',
  START_GAME = 'start game',
  UPDATE_GAME = 'update game',

  CREATE_SUCCESS = 'create success',
  CREATE_FAILURE = 'create failure',

  START_SUCCESS = 'start success',
  START_FAILURE = 'start failure',

  UPDATE_SUCCESS = 'update success',
  UPDATE_FAILURE = 'update failure',
}

export enum CommonEvent {
  AUTH_REQUEST = 'authenticate',
  AUTHENTICATED = 'authenticated',
  UNAUTHORIZED = 'unauthorized',

  CONNECT = 'connect',
  PLAYER_JOINED = 'player joined',
}

export type EmittedEvent =
  | {
      event: PlayerEvent.JOIN_GAME;
      data: null;
    }
  | {
      event: HostEvent.CREATE_ROOM;
      data: string; // game id
    }
  | {
      event: HostEvent.JITSI_READY;
      data: {
        gameId: string;
        jitsiRoom: string;
      };
    }
  | {
      event: HostEvent.START_GAME;
      data: string; // game id
    }
  | {
      event: HostEvent.UPDATE_GAME;
      data: ActiveGame; // game id
    };

export interface RecievedError {
  error: string;
}

// TESTING

export interface MockSocket {
  listeners: Record<string, Function>;
  emitted: Record<string, object>;
  on: Function;
  emit: Function;
}
