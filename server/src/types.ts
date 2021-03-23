import { Document } from 'mongoose';
import { Socket } from 'socket.io';
import UpdateEmittingTimer from './utils/timer';

export interface GameModel extends NewGame, Document {
  createDate: Date;
}

export interface BaseRTCGame {
  type: GameType;
  status: GameStatus;
  startTime: Date;
  rounds: number;
  price: number;
  allowedSpectators: number;
}

export interface RTCGame extends BaseRTCGame {
  id: string;
  players: GamePlayer[];
  info: GameInfo;
  host: {
    id: string;
    displayName: string;
    privateData: null;
  };
}

export interface NewGame extends BaseRTCGame {
  players: GamePlayer[];
  host: {
    id: UserModel['_id'];
    displayName: string;
    privateData: null;
  };
}

export interface WordModel extends Document {
  word: string;
}

export interface UrlModel extends Document {
  hostName: string;
  gameId: string;
  playerId: string;
  inviteCode: string;
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
  KOTITONNI = 'kotitonni',
}

export interface BaseGamePlayer {
  name: string;
  id: string;
  points: number;
  reservedFor: ReservationData | null;
}

export interface ReservationData {
  id: string;
  expires: number;
  locked?: boolean;
}

export interface KotitonniPlayer extends BaseGamePlayer {
  privateData: KotitonniData;
}

export interface PlayerPrivateData {
  inviteCode: string;
}

export interface KotitonniData extends PlayerPrivateData {
  answers: Record<string, Record<string, string>>;
  words: string[];
}

export type PrivateData = KotitonniData; // additional games here

export type GamePlayer = KotitonniPlayer;

export interface FilteredGamePlayer extends BaseGamePlayer {
  privateData: PrivateData | null;
}

export interface KotitonniInfo {
  round: number;
  turn: string; // player id
}

export type GameInfo = KotitonniInfo;

export enum Role {
  HOST = 'HOST',
  PLAYER = 'PLAYER',
  SPECTATOR = 'SPECTATOR',
}

export interface SocketIOAuthToken {
  id: string;
  username: string;
  role: Role;
  gameId: string;
  type: 'rtc';
}

export interface SocketWithToken extends Socket {
  decodedToken: SocketIOAuthToken;
}

export interface RTCGameRoom {
  game: RTCGame;
  socketMap: Map<string, string | null>; // <player id, player socket id>
  spectatorSockets: string[];
  lastUpdated: number;
  state: RTCGameState;
}

export type RTCGameState = KotitonniGameState;

export interface KotitonniGameState {
  timer: UpdateEmittingTimer;
}

export interface FilteredRTCGame extends BaseRTCGame {
  host: {
    id: string;
    displayName: string;
    privateData: null;
  };
  players: FilteredGamePlayer[];
}

export interface Answer {
  answer: string;
  info: GameInfo;
}

// emails

export interface BaseInviteInfo {
  url: string;
  cancelUrl: string;
  displayName: string;
  gameType: GameType;
  startTime: Date;
}

export interface KotitonniInviteInfo extends BaseInviteInfo {
  gameType: GameType.KOTITONNI;
  data: {
    words: string[];
  };
}

export type InviteInfo = KotitonniInviteInfo; // additional games here

export interface InviteMailContent {
  text: string;
  html: string;
}
