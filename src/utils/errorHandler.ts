/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ErrorRequestHandler } from 'express';
import { toError } from './mappers';

const errorHandler: ErrorRequestHandler = (error, _request, response, next) => {
  const { message, name } = toError(error);

  if (process.env.NODE_ENV !== 'test') console.log('Error:', message);

  // mongo errors, ie duplicate fields
  if (name === 'MongoError') {
    if (message.split(' ').includes('duplicate'))
      return response.status(400).send('Duplicate fields');
  }

  if (name === 'CastError') {
    return response.status(400).send('Invalid game id');
  }

  // credentials wrong
  if (message === 'Invalid username or password') {
    return response.status(401).send(message);
  }

  // missing or invalid field in request
  if (message.startsWith('Invalid') || message.startsWith('Missing')) {
    return response.status(400).send(message);
  }

  return next(error);
};

export default errorHandler;
