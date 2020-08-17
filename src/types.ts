import { Document } from 'mongoose';

export interface GameModel extends NewGame, Document {
  createDate: Date;
}

export interface BaseGame {
  type: GameType;
  status: GameStatus;
  startTime: Date;
  rounds: number;
}

export interface NewGame extends BaseGame {
  players: GamePlayer[];
  host: UserModel['_id'];
}

export interface WordModel extends Document {
  word: string;
}

export interface UrlModel extends Document {
  hostName: string;
  gameId: string;
  playerId: string;
}

export interface UserModel extends Document {
  username: string;
  email: string;
  passwordHash: string;
  channelName: string;
  joinDate: Date;
}

export interface UserCredentials {
  username: string;
  password: string;
}

export interface NewUser extends UserCredentials {
  channelName: string;
  email: string;
}

export enum GameStatus {
  RUNNING = 'Running',
  WAITING = 'Waiting for players',
  UPCOMING = 'Upcoming',
  FINISHED = 'Finished',
}

export enum GameType {
  SANAKIERTO = 'sanakierto',
}

export interface GamePlayer {
  name: string;
  id: string;
  points: number;
}

export interface ActiveGamePlayer extends GamePlayer {
  socket: null | string;
  online: boolean;
}

export interface SanakiertoInfo {
  round: number;
  turn: string; // player id
}

export type GameInfo = SanakiertoInfo;

export type ActiveGame = WaitingGame | RunningGame;

export interface BaseActiveGame extends BaseGame {
  id: string;
  players: ActiveGamePlayer[];
}

export interface WaitingGame extends BaseActiveGame {
  status: GameStatus.WAITING;
  info: null;
}

export interface RunningGame extends BaseActiveGame {
  status: GameStatus.RUNNING;
  info: GameInfo;
}

export interface CreateRoomResponse {
  jitsiToken: string;
  jitsiRoom: string;
  game: ActiveGame;
}

export interface GameRoom {
  id: string;
  hostSocket: string;
  game: ActiveGame;
  jitsiRoom: string;
}

export interface CreateRoomData {
  gameId: string;
}

export interface JitsiReadyData {
  gameId: string;
  jitsiRoom: string;
}

export enum TestEventType {
  GET_ROOMS = 'get socket rooms',
  JOIN_ROOM = 'join room',
  BROADCAST_TO = 'broadcast to',

  ROOM_JOINED = 'room joined',
  ROOMS_RECEIVED = 'socket rooms',
}

export enum EventType {
  // EMITTED
  AUTH = 'authenticate',

  CREATE_SUCCESS = 'create success',
  CREATE_FAILURE = 'create failure',

  UPDATE_SUCCESS = 'update success',
  UPDATE_FAILURE = 'update failure',

  JOIN_SUCCESS = 'join success',
  JOIN_FAILURE = 'join failure',

  START_SUCCESS = 'start success',
  START_FAILURE = 'start failure',

  END_SUCCESS = 'end success',
  END_FAILURE = 'end failure',

  // BROADCASTED

  PLAYER_JOINED = 'player joined',
  GAME_READY = 'game ready',
  GAME_STARTING = 'game starting',
  GAME_UPDATED = 'game updated',
  GAME_ENDED = 'game ended',

  // RECIEVED

  CONNECTION = 'connection',
  DISCONNECT = 'disconnect',
  AUTHENTICATED = 'authenticated',
  UNAUTHORIZED = 'unauthorized',

  // host
  CREATE_ROOM = 'create room',
  JITSI_READY = 'jitsi ready',
  START_GAME = 'start game',
  UPDATE_GAME = 'update game',
  END_GAME = 'end game',

  // player
  JOIN_GAME = 'join game',
}

export type BroadcastedEvent =
  | {
      event: EventType.GAME_READY;
      data: string; // jitsi room name
    }
  | {
      event: EventType.PLAYER_JOINED;
      data: string; // player id
    }
  | {
      event: EventType.GAME_STARTING;
      data: ActiveGame;
    }
  | {
      event: EventType.GAME_UPDATED;
      data: ActiveGame;
    }
  | {
      event: EventType.GAME_ENDED;
      data: null;
    };

export type EmittedEvent =
  | {
      event: EventType.CREATE_SUCCESS;
      data: CreateRoomResponse;
    }
  | {
      event: EventType.CREATE_FAILURE;
      data: {
        error: string;
      };
    }
  | {
      event: EventType.UPDATE_SUCCESS;
      data: ActiveGame;
    }
  | {
      event: EventType.UPDATE_FAILURE;
      data: {
        error: string;
      };
    }
  | {
      event: EventType.JOIN_SUCCESS;
      data: {
        game: ActiveGame;
        jitsiRoom: string;
      };
    }
  | {
      event: EventType.JOIN_FAILURE;
      data: {
        error: string;
      };
    }
  | {
      event: EventType.START_SUCCESS;
      data: ActiveGame;
    }
  | {
      event: EventType.START_FAILURE;
      data: {
        error: string;
      };
    }
  | {
      event: EventType.END_SUCCESS;
      data: string; // game id
    }
  | {
      event: EventType.END_FAILURE;
      data: {
        error: string;
      };
    };

export type RecievedEvent =
  | {
      event: EventType.CREATE_ROOM;
      data: CreateRoomData;
    }
  | {
      event: EventType.JITSI_READY;
      data: string; // jitsi room
    }
  | {
      event: EventType.JOIN_GAME;
    }
  | {
      event: EventType.GAME_ENDED;
    };

export enum Role {
  HOST = 'HOST',
  PLAYER = 'PLAYER',
}

export interface SocketIOAuthToken {
  id: string;
  username: string;
  role: Role;
  gameId: string;
}

export interface SocketWithToken extends SocketIO.Socket {
  decoded_token: SocketIOAuthToken;
}
