export interface UserCredentials {
  username: string;
  password: string;
}

export interface NewUser extends UserCredentials {
  channelName: string;
  email: string;
}

export interface NewGame {
  players: GamePlayer[];
  startTime: Date;
  type: GameType;
}

export type GameType = 'sanakierto';

export interface GamePlayer {
  name: string;
  id: string;
}
