/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ErrorRequestHandler } from 'express';
import { toErrorMessage } from './mappers';

const createError = (message: string) => {
  return {
    error: message,
  };
};

/** @TODO handle duplicate fields with existing users */

const errorHandler: ErrorRequestHandler = (error, _request, response, next) => {
  const message = toErrorMessage(error.message);

  if (process.env.NODE_ENV !== 'test') console.log('Error:', message);

  if (message === 'Invalid username or password') {
    response.status(401).json(createError(message));
  }

  if (
    message.startsWith('Invalid fied') ||
    message.startsWith('Missing field')
  ) {
    response.status(400).json(createError(message));
  }

  next(error);
};

export default errorHandler;
