import { Socket } from 'socket.io';
import { Document } from 'mongoose';

export interface GameModel extends NewGame, Document {
  createDate: Date;
}

export interface BaseGame {
  type: GameType;
  status: GameStatus;
  startTime: Date;
}

export interface NewGame extends BaseGame {
  players: GamePlayer[];
  host: UserModel['_id'];
  rounds?: number;
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

export type GameType = 'sanakierto';

export interface GamePlayer {
  name: string;
  id: string;
}

export interface ActiveGamePlayer extends GamePlayer {
  socket: null | Socket;
}

export interface ActiveGame extends BaseGame {
  id: string;
  players: ActiveGamePlayer[];
  status: GameStatus.WAITING | GameStatus.RUNNING;
}

export interface GameRoom {
  id: string;
  hostSocket: string;
  game: ActiveGame;
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

  JOIN_SUCCESS = 'join success',
  JOIN_FAILURE = 'join failure',

  GAME_READY = 'game ready',

  // RECIEVED

  UNAUTHORIZED = 'unauthorized',

  // host
  CREATE_ROOM = 'create room',
  JITSI_READY = 'jitsi ready',

  // player
  JOIN_GAME = 'join game',
}

export type BroadcastedEvent =
  | {
      event: EventType.GAME_READY;
      data: string; // jitsi room name
    }
  | {
      event: EventType.GAME_READY;
      data: string; // jitsi room name
    };

export type EmittedEvent =
  | {
      event: EventType.CREATE_SUCCESS;
      data: string; // jitsi token
    }
  | {
      event: EventType.CREATE_FAILURE;
      data: {
        error: string;
      };
    }
  | {
      event: EventType.JOIN_SUCCESS;
      data: ActiveGame;
    }
  | {
      event: EventType.JOIN_FAILURE;
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
    }
  | {
      event: EventType.JOIN_GAME;
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
