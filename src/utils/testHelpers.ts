/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import User, { UserModel } from '../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { NewUser } from '../types';
import Game, { GameModel } from '../models/game';

const usersInDb = async (): Promise<UserModel[]> => {
  return await User.find({});
};

const gamesInDb = async (): Promise<GameModel[]> => {
  return await Game.find({});
};

const addDummyGame = async (user: UserModel): Promise<GameModel> => {
  const dummyGame = {
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
    createDate: new Date(),
  };

  const game = new Game(dummyGame);

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

export default {
  usersInDb,
  addDummyUser,
  gamesInDb,
  addDummyGame,
  getValidToken,
};
