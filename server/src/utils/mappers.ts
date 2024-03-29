/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  NewUser,
  UserCredentials,
  NewGame,
  GameType,
  GamePlayer,
  GameStatus,
  GameModel,
  DecodedToken,
} from '../types';
import { Error } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const isString = (text: any): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isError = (object: any): object is Error => {
  return isString(object.name) && isString(object.message);
};

const isGameType = (text: any): text is GameType => {
  // additional games here
  return Object.values(GameType).includes(text);
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

const isGameStatus = (status: any): status is GameStatus => {
  return Object.values(GameStatus).includes(status);
};

const isNumber = (number: any): number is number => {
  const casted = Number(number);

  if (isNaN(casted)) {
    return false;
  }

  return true;
};

export const parseString = (str: any, fieldName?: string): string => {
  if (!str) {
    const errorMsg = 'Missing string to be parsed';

    throw new Error(fieldName ? `Missing field '${fieldName}'` : errorMsg);
  }
  if (!isString(str))
    throw new Error(
      fieldName
        ? `Incorrect field ${fieldName}. Expected string, got ${typeof str}`
        : 'Object is not a string'
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

const parseStatus = (status: any): GameStatus => {
  if (!status) throw new Error('Missing game status');
  if (!isString(status) || !isGameStatus(status))
    throw new Error('Missing game status');

  return status;
};

const parseRounds = (rounds: any): number => {
  if (!rounds) throw new Error('Missing rounds');
  if (!isNumber(rounds)) throw new Error('Invalid rounds');

  return Number(rounds);
};

const parseNumber = (number: any): number => {
  if (number === undefined || number === null) {
    throw new Error('Missing number');
  }

  if (!isNumber(number)) {
    throw new Error('Invalid number');
  }

  return Number(number);
};

export const parseEmail = (email: any): string => {
  if (!email || !isString(email)) {
    throw new Error('Invalid or missing email');
  }

  if (
    !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.exec(
      email
    )
  ) {
    throw new Error('Invalid email');
  }

  return email;
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
    username: parseString(object.username, 'username').trim(),
    password: parseString(object.password, 'password'),
    email: parseString(object.email, 'email').toLowerCase().trim(),
    firstName: parseString(object.firstName, 'firstName').trim(),
    lastName: parseString(object.lastName, 'lastName').trim(),
    birthYear: parseNumber(object.birthYear),
    status: 'pending',
    confirmationId: uuidv4(),
  };
};

export const toNewGame = (object: any, user: DecodedToken): NewGame => {
  return {
    type: parseGameType(object.type),
    startTime: parseDate(object.startTime),
    players: parsePlayers(object.players),
    status: parseStatus(object.status),
    host: {
      id: user.id,
      displayName: user.username,
    },
    rounds: parseRounds(object.rounds),
    price: parseNumber(object.price),
    allowedSpectators: parseNumber(object.allowedSpectators),
  };
};

export const toPositiveInteger = (object: any): number => {
  const number = parseNumber(object);

  if (!Number.isInteger(number)) throw new Error('Invalid number');
  if (number < 1) throw new Error('Invalid number');

  return number;
};

export const toAuthenticatedUser = (request: any): DecodedToken => {
  if (
    !request ||
    !request.user ||
    !request.user.username ||
    !request.user.id ||
    !isString(request.user.username) ||
    !isString(request.user.id)
  )
    throw new Error('Invalid or missing user');

  return request.user as DecodedToken;
};

export const toCredentials = (object: any): UserCredentials => {
  return {
    usernameOrEmail: parseString(object.username, 'username / email'),
    password: parseString(object.password, 'password'),
  };
};

/**
 * Checks if the game's host field matches given id. Throws error if not.
 * @param game - game returned from mongodb
 * @param hostId - id to match against game's host
 *
 * @returns validated game
 */
export const validateGameHost = (
  game: GameModel | null,
  hostId: string
): GameModel => {
  if (!game) throw new Error('Missing game');
  if (!game.host || !game.host.id.toString) {
    throw new Error('Missing or invalid game host');
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  if (game.host.id.toString() !== hostId) {
    throw new Error('Invalid request, cannot remove games added by others');
  }

  return game;
};

/**
 * Checks if a player matching given id is found from the given game. If not, throws error.
 * @param game - game returned from mongodb
 * @param inviteCode - code to check for in game players
 *
 * @returns player matching code
 */
export const validateGamePlayer = (
  game: GameModel | null,
  inviteCode: string
): GamePlayer => {
  if (!game) throw new Error('Missing game');

  const matchingPlayer = game.players.find(
    (player) => player.privateData.inviteCode === inviteCode
  );

  if (!matchingPlayer)
    throw new Error(
      `Invalid request, no player found with invite code ${inviteCode}`
    );

  return matchingPlayer;
};

export const toID = (object: any): string => {
  return parseString(object, 'game/reservation id');
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

export const capitalize = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
