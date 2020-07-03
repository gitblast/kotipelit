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

  if (name === 'CastError') {
    response.status(400).json(createError('Invalid game id'));
  }

  // credentials wrong
  if (message === 'Invalid username or password') {
    response.status(401).json(createError(message));
  }

  // missing or invalid field in request
  if (message.startsWith('Invalid') || message.startsWith('Missing')) {
    response.status(400).json(createError(message));
  }

  next(error);
};

export default errorHandler;
