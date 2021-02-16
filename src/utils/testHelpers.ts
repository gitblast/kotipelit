/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import User from '../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import {
  NewUser,
  NewGame,
  GameStatus,
  UserModel,
  GameModel,
  GameType,
  WordModel,
  Role,
} from '../types';
import Game from '../models/game';
import Word from '../models/word';
import Url from '../models/url';

const usersInDb = async (): Promise<UserModel[]> => {
  return await User.find({});
};

const gamesInDb = async (): Promise<GameModel[]> => {
  return await Game.find({});
};

const addDummyWords = async (words: string[]): Promise<WordModel[]> => {
  const wordsToAdd = words.map((word) => new Word({ word }));

  const savedWords = [];

  for (const word of wordsToAdd) {
    const saved = await word.save();
    savedWords.push(saved);
  }

  return savedWords;
};

const addDummyGame = async (user: UserModel): Promise<GameModel> => {
  const dummyGame: NewGame = {
    type: GameType.KOTITONNI,
    price: 10,
    players: [
      {
        id: 'id1',
        name: 'player1',
        points: 0,
        privateData: {
          answers: {},
          words: [],
          twilioToken: null,
          inviteCode: 'player1code',
          socketId: null,
        },
        reservedFor: null,
      },
      {
        id: 'id2',
        name: 'player2',
        points: 0,
        privateData: {
          answers: {},
          words: [],
          inviteCode: 'player2code',
          twilioToken: null,
          socketId: null,
        },
        reservedFor: null,
      },
    ],
    startTime: new Date(),
    host: {
      id: user._id,
      privateData: {
        socketId: null,
        twilioToken: null,
      },
    },
    status: GameStatus.UPCOMING,
    rounds: 3,
  };

  const game = new Game({ ...dummyGame, info: {}, createDate: new Date() });

  const savedGame = await game.save();

  for (const player of savedGame.players) {
    const newUrl = {
      hostName: user.username,
      playerId: player.id,
      gameId: savedGame._id.toString(),
      inviteCode: player.privateData.inviteCode,
    };

    await new Url(newUrl).save();
  }

  return savedGame;
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

const getValidToken = (user: UserModel, secret: string, role: Role): string => {
  const tokenUser = {
    username: user.username,
    id: user._id,
    role,
  };

  return jwt.sign(tokenUser, secret);
};

export interface SocketIOParams {
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
  addDummyWords,
};
