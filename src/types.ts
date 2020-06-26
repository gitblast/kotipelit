import { UserModel } from './models/user';

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

export interface NewGame {
  players: GamePlayer[];
  startTime: Date;
  type: GameType;
  status: GameStatus;
  host: UserModel['_id'];
  rounds?: number;
}

export type GameType = 'sanakierto';

export interface GamePlayer {
  name: string;
  id: string;
}
