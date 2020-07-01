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

export enum EventType {
  // emitted
  CREATE_SUCCESS = 'create success',
  CREATE_FAILURE = 'create failure',

  // recieved
  CREATE_ROOM = 'create room',
}

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
    };

export type RecievedEvent =
  | {
      event: EventType.CREATE_ROOM;
      data: CreateRoomData;
    }
  | {
      event: EventType.CREATE_FAILURE;
      data: {
        error: string;
      };
    };

export enum Role {
  HOST = 'HOST',
  PLAYER = 'PLAYER',
}

export interface SocketIOAuthToken {
  id: string;
  username: string;
  role: Role;
}

export interface SocketWithToken extends SocketIO.Socket {
  decoded_token: SocketIOAuthToken;
}
