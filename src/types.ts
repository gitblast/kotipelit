// JITSI

export interface JitsiApi {
  on: (event: string, listener: () => void) => void;
  dispose: () => void;
}

// GAMES

export enum GameType {
  KOTITONNI = 'kotitonni',
}

export interface Game extends BaseGame {
  id: string;
  status: GameStatus;
}

export interface BaseGame {
  type: GameType;
  startTime: Date;
  price: number;
}

export interface ReservationResponse {
  playerId: string;
  expiresAt: number;
}

export interface LobbyGamePlayer {
  name: string;
  id: string;
  reservedFor: ReservationData | null;
  email: string | null;
  privateData?: PrivateData;
  reservedForMe?: boolean;
  lockedForMe?: boolean;
  url?: string;
}

export interface ReservationData {
  id: string;
  expires: number;
  locked?: boolean;
}

export interface LobbyGame extends BaseGame {
  players: LobbyGamePlayer[];
  hostName: string;
}

export interface BasePrivateData {
  inviteCode: string;
  twilioToken: string | null;
  socketId: string | null;
}

export interface KotitonniPrivateData extends BasePrivateData {
  answers: Record<string, Record<string, string>>;
  words: string[];
}

export type PrivateData = KotitonniPrivateData;

export interface RTCKotitonniPlayer {
  id: string;
  name: string;
  points: number;
  hasTurn?: boolean;
  privateData: KotitonniPrivateData;
}

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
  displayName: null | string;
  loggingIn: boolean;
}

export interface LoggedUser {
  username: string;
  loggedIn: true;
  token: string;
  jitsiToken: string | null;
  socket: null | SocketIOClient.Socket;
  jitsiRoom: null | string;
  loggingIn: boolean;
}

export interface LoggingUser extends Omit<BaseUser, 'loggingIn'> {
  loggingIn: true;
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
  alert: AlertState;
  rtc: RTCState;
}

export interface RTCState {
  game: RTCGame | null;
  localData: LocalData;
  self: RTCSelf | null;
}

export type AlertState = string | null;

export interface GamesState {
  allGames: RTCGame[];
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
  SET_GAMES = 'SET_GAMES',

  // init games
  INIT_GAMES_REQUEST = 'INIT_GAMES_REQUEST',
  INIT_GAMES_SUCCESS = 'INIT_GAMES_SUCCESS',
  INIT_GAMES_FAILURE = 'INIT_GAMES_FAILURE',

  // add game
  ADD_GAME_REQUEST = 'ADD_GAME_REQUEST',
  ADD_GAME_SUCCESS = 'ADD_GAME_SUCCESS',
  ADD_GAME_FAILURE = 'ADD_GAME_FAILURE',

  ADD_LOCAL_GAME = 'ADD_LOCAL_GAME',

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

  // ALERT ACTIONS

  SET_ERROR = 'SET_ERROR',
  CLEAR_ERROR = 'CLEAR_ERROR',
}

export type Action =
  | {
      type: ActionType.SET_GAMES;
      payload: RTCGame[];
    }
  // INIT GAMES
  | {
      type: ActionType.INIT_GAMES_REQUEST;
    }
  | {
      type: ActionType.INIT_GAMES_SUCCESS;
      payload: RTCGame[];
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
      payload: RTCGame;
    }
  | {
      type: ActionType.ADD_GAME_FAILURE;
    }
  | {
      type: ActionType.ADD_LOCAL_GAME;
      payload: RTCGame;
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
      payload: RTCGame; // game id
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

  // ERRORS
  | {
      type: ActionType.SET_ERROR;
      payload: string;
    }
  | {
      type: ActionType.CLEAR_ERROR;
    };

export type LocalData = KotitonniLocalData;

export type LocalDataAction = KotitonniLocalAction;

export interface KotitonniLocalData {
  clickedMap: Record<string, boolean>;
  timer: number;
  mutedMap: Record<string, boolean>;
}

export type KotitonniLocalAction =
  | {
      type: 'SET_CLICK';
      payload: {
        playerId: string;
        clicked: boolean;
      };
    }
  | {
      type: 'SET_TIMER';
      payload: number;
    }
  | {
      type: 'SET_MUTED';
      payload: {
        playerId: string;
        muted: boolean;
      };
    }
  | {
      type: 'RESET';
    };

export type RTCGameAction = {
  type: 'SET_GAME';
  payload: RTCGame;
};

export type RTCSelfAction =
  | {
      type: 'SET_SELF';
      payload: RTCSelf;
    }
  | {
      type: 'SET_STREAM';
      payload: MediaStream;
    };

// SOCKET IO EVENTS

export enum PlayerEvent {
  JOIN_GAME = 'join game',

  GAME_UPDATED = 'game updated',
  GAME_ENDED = 'game ended',
}

export enum HostEvent {
  CREATE_ROOM = 'create room',
  START_GAME = 'start game',
  UPDATE_GAME = 'update game',
  END_GAME = 'end game',
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
      event: HostEvent.START_GAME;
      data: string; // game id
    }
  | {
      event: HostEvent.END_GAME;
      data: string; // game id
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

export interface RTCSelf {
  id: string;
  isHost: boolean;
  socket: SocketIOClient.Socket;
  stream: MediaStream | null;
}

export type GamePlayer = RTCKotitonniPlayer; // handle other game types here

export interface KotitonniInfo {
  round: number;
  turn: string; // player id
  answeringOpen: boolean;
}

export interface RTCPeer {
  id: string;
  peerId: string;
  socketId: string;
  displayName: string;
  stream: null | MediaStream;
  isHost: boolean;
  isMe: boolean;
}

export type GameInfo = KotitonniInfo;

export interface RTCGame {
  id: string;
  status: GameStatus;
  type: GameType;
  price: number;
  rounds: number;
  startTime: Date;
  players: GamePlayer[];
  info: GameInfo;
  host: {
    id: string;
    socketId: string | null;
  };
}

export enum Role {
  HOST = 'host',
  PLAYER = 'player',
}

// useGameToken hook

export interface PlayerGameTokenConfig {
  type: Role.PLAYER;
  username: string;
  playerId: string;
}

export interface HostGameTokenConfig {
  type: Role.HOST;
  gameId: string;
}

export type GameTokenConfig = PlayerGameTokenConfig | HostGameTokenConfig;

export interface IceServers {
  username: string;
  urls: string[];
  credential: string;
}
