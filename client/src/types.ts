// GAMES

import { Socket } from 'socket.io-client';
import { RemoteParticipant, LocalParticipant } from 'twilio-video';

export interface ErrorState {
  error: Error;
  explanationMsg: string;
}

export interface GameErrorState {
  errorState: ErrorState | null;
  setError: GameErrorSetter;
}

export type GameErrorSetter = (
  error: Error | null,
  explanationMsg: string
) => void;

export interface GameData {
  game: RTCGame;
  updateGame: (updatedGame: RTCGame) => void;
  self: RTCSelf;
  socket: Socket;
}

export interface MediaMutedStates {
  setMuted: (participantId: string, muted: boolean) => void;
  mutedMap: Record<string, boolean>;
  videoDisabledMap: Record<string, boolean>;
  toggleMuted: (participantId: string) => void;
  toggleVideoDisabled: (participantId: string) => void;
}

export interface KotitonniLocalData {
  clickedMap: Record<string, boolean>;
  toggleClicked: (playerId: string) => void;
  setClicked: (playerId: string, clicked: boolean) => void;
  resetClicks: () => void;
}

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
  id: string;
  allowedSpectators: number;
  players: LobbyGamePlayer[];
  hostName: string;
}

export interface BasePrivateData {
  inviteCode: string;
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
  isMe?: boolean;
}

export enum GameStatus {
  RUNNING = 'Running',
  WAITING = 'Waiting for players',
  UPCOMING = 'Upcoming',
  FINISHED = 'Finished',
}

export interface UserToAdd {
  username: string;
  firstName: string;
  lastName: string;
  birthYear: number;
  email: string;
  password: string;
}
export interface LoggedInUser {
  username: string;
  loggedIn: true;
  token: string;
}

export interface DefaultUser {
  loggedIn: false;
}

export type AppUser = DefaultUser | LoggedInUser;

// SOCKET IO EVENTS

export enum CommonEvent {
  AUTH_REQUEST = 'authenticate',
  AUTHENTICATED = 'authenticated',
  UNAUTHORIZED = 'unauthorized',

  CONNECT = 'connect',
  PLAYER_JOINED = 'player joined',
}

export interface RecievedError {
  error: string;
}

// TESTING

export interface MockSocket {
  listeners: Record<string, (...args: any[]) => void>;
  emitted: Record<string, (...args: any[]) => void>;
  on: unknown;
  emit: unknown;
}

export interface RTCSelf {
  id: string;
  role: Role;
}

export type GamePlayer = RTCKotitonniPlayer; // handle other game types here

export interface TimerData {
  value: number;
  isRunning: boolean;
}

export interface KotitonniInfo {
  round: number;
  turn: string; // player id
  timer: TimerData;
}

export interface InGameTimerData {
  timerValue: number | null;
  timerIsRunning: boolean | null;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  toggleTimer: () => void;
}

export type GameInfo = KotitonniInfo;

export interface RTCGame {
  id: string;
  status: GameStatus;
  type: GameType;
  price: number;
  allowedSpectators: number;
  rounds: number;
  startTime: Date;
  players: GamePlayer[];
  info: GameInfo;
  host: {
    id: string;
    displayName: string;
    privateData?: null;
  };
}

export type GameToAdd = Pick<
  RTCGame,
  | 'startTime'
  | 'type'
  | 'players'
  | 'status'
  | 'rounds'
  | 'price'
  | 'allowedSpectators'
>;

export enum Role {
  HOST = 'HOST',
  PLAYER = 'PLAYER',
  SPECTATOR = 'SPECTATOR',
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

export interface RemoteRTCParticipant {
  id: string;
  isHost?: boolean;
  connection: RemoteParticipant | null;
  isMe: false;
  displayName: string;
}

export interface LocalRTCParticipant {
  id: string;
  isHost?: boolean;
  connection: LocalParticipant | null;
  isMe: true;
  displayName: string;
}

export type RTCParticipant = RemoteRTCParticipant | LocalRTCParticipant;
