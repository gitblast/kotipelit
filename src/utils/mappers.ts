/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NewUser, UserCredentials } from '../types';

const isString = (text: any): text is string => {
  return typeof text === 'string' || text instanceof String;
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

export const toErrorMessage = (message: any): string => {
  if (!message) throw new Error('Error message missing');
  if (!isString(message)) throw new Error('Error message invalid');

  return message;
};
