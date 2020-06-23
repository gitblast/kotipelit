/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  NewUser,
  UserCredentials,
  NewGame,
  GameType,
  GamePlayer,
} from '../types';
import { Error } from 'mongoose';

const isString = (text: any): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isError = (object: any): object is Error => {
  return isString(object.name) && isString(object.message);
};

const isGameType = (text: any): text is GameType => {
  // additional games here
  return ['sanakierto'].includes(text);
};

const isDate = (date: any): boolean => {
  if (!isString(date)) return false;

  return Boolean(Date.parse(date));
};

const isArray = (obj: any): obj is [] => {
  return Array.isArray(obj);
};

const isGamePlayer = (player: any): player is GamePlayer => {
  return (
    player.id && player.name && isString(player.id) && isString(player.name)
  );
};

const parseString = (str: any, fieldName: string): string => {
  if (!str) throw new Error(`Missing field '${fieldName}'`);
  if (!isString(str))
    throw new Error(
      `Incorrect field ${fieldName}. Expected string, got ${typeof str}`
    );

  return str;
};

const parseGameType = (type: any): GameType => {
  if (!type) throw new Error('Missing gametype');
  if (!isGameType(type)) throw new Error('Invalid gametype');

  return type;
};

const parseDate = (date: any): Date => {
  if (!date) throw new Error('Missing date');
  if (!isDate(date)) throw new Error('Invalid date');

  return date as Date;
};

const parsePlayers = (players: any): GamePlayer[] => {
  if (!players) throw new Error('Missing players');
  if (!isArray(players)) throw new Error('Invalid players');

  players.forEach((player: any) => {
    if (!isGamePlayer(player)) throw new Error('Invalid player');
  });

  return players;
};

export const toNewUser = (object: any): NewUser => {
  return {
    username: parseString(object.username, 'username'),
    password: parseString(object.password, 'password'),
    email: parseString(object.email, 'email'),
    channelName: parseString(object.channelName, 'channel name'),
  };
};

export const toNewGame = (object: any): NewGame => {
  return {
    type: parseGameType(object.type),
    startTime: parseDate(object.startTime),
    players: parsePlayers(object.players),
    host: parseString(object.host, 'host id'),
  };
};

export const toCredentials = (object: any): UserCredentials => {
  return {
    username: parseString(object.username, 'username'),
    password: parseString(object.password, 'password'),
  };
};

interface ErrorToHandle {
  message: string;
  name: string;
}

export const toError = (error: any): ErrorToHandle => {
  if (!error) throw new Error('Error missing');
  if (!error.message) throw new Error('Error message missing');
  if (!error.name) throw new Error('Error name missing');
  if (!isError(error)) throw new Error('Error name or message invalid');

  return error;
};
