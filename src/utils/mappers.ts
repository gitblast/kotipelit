/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NewUser, UserCredentials } from '../types';
import { Error } from 'mongoose';

const isString = (text: any): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isError = (object: any): object is Error => {
  return isString(object.name) && isString(object.message);
};

const parseString = (str: any, fieldName: string): string => {
  if (!str) throw new Error(`Missing field '${fieldName}'`);
  if (!isString(str))
    throw new Error(
      `Incorrect field ${fieldName}. Expected string, got ${typeof str}`
    );

  return str;
};

export const toNewUser = (object: any): NewUser => {
  return {
    username: parseString(object.username, 'username'),
    password: parseString(object.password, 'password'),
    email: parseString(object.email, 'email'),
    channelName: parseString(object.channelName, 'channel name'),
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
