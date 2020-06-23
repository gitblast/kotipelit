/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ErrorRequestHandler } from 'express';
import { toError } from './mappers';

const createError = (message: string) => {
  return {
    error: message,
  };
};

const errorHandler: ErrorRequestHandler = (error, _request, response, next) => {
  const { message, name } = toError(error);

  if (process.env.NODE_ENV !== 'test') console.log('Error:', message);

  // mongo errors, ie duplicate fields
  if (name === 'MongoError') {
    if (message.split(' ').includes('duplicate'))
      response.status(400).json(createError('Duplicate fields'));
  }

  // credentials wrong
  if (message === 'Invalid username or password') {
    response.status(401).json(createError(message));
  }

  // invalid field in user object
  if (
    message.startsWith('Invalid fied') ||
    message.startsWith('Missing field')
  ) {
    response.status(400).json(createError(message));
  }

  next(error);
};

export default errorHandler;
