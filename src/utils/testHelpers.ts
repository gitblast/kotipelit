/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import User from '../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { NewUser, NewGame, GameStatus, UserModel, GameModel } from '../types';
import Game from '../models/game';

const usersInDb = async (): Promise<UserModel[]> => {
  return await User.find({});
};

const gamesInDb = async (): Promise<GameModel[]> => {
  return await Game.find({});
};

const addDummyGame = async (user: UserModel): Promise<GameModel> => {
  const dummyGame: NewGame = {
    type: 'sanakierto',
    players: [
      {
        id: 'id1',
        name: 'player1',
      },
      {
        id: 'id2',
        name: 'player2',
      },
    ],
    startTime: new Date(),
    host: user._id,
    status: GameStatus.UPCOMING,
  };

  const game = new Game({ ...dummyGame, createDate: new Date() });

  return await game.save();
};

const addDummyUser = async (
  username: string = Date.now().toString(),
  password: string = Date.now().toString(),
  email: string = Date.now().toString(),
  channelName: string = Date.now().toString()
): Promise<UserModel> => {
  const newUser: NewUser = {
    username,
    password,
    email,
    channelName,
  };

  const passwordHash = await bcrypt.hash(newUser.password, 10);

  const user = new User({
    username: newUser.username,
    email: newUser.email,
    channelName: newUser.channelName,
    passwordHash,
    joinDate: new Date(),
  });

  return await user.save();
};

const getValidToken = (user: UserModel, secret: string): string => {
  const tokenUser = {
    username: user.username,
    id: user._id,
  };

  return jwt.sign(tokenUser, secret);
};

interface SocketIOParams {
  path: string;
  options: {
    'reconnection delay': 0;
    'reopen delay': 0;
    'force new connection': true;
    transports: ['websocket'];
    reconnection: false;
  };
}

const getSocketIOParams = (address: string, port: string): SocketIOParams => ({
  path: `http://[${address}]:${port}`,
  options: {
    'reconnection delay': 0,
    'reopen delay': 0,
    'force new connection': true,
    reconnection: false,
    transports: ['websocket'],
  },
});

export default {
  usersInDb,
  addDummyUser,
  gamesInDb,
  addDummyGame,
  getValidToken,
  getSocketIOParams,
};
