export interface UserCredentials {
  username: string;
  password: string;
}

export interface NewUser extends UserCredentials {
  channelName: string;
  email: string;
}
