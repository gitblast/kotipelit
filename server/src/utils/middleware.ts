import { Request, Response, NextFunction } from 'express';
import expressJwt from 'express-jwt';
import { DecodedToken, Role } from '../types';
import config from './config';
import logger from './logger';
import User from '../models/user';

export const onlyForRole = (role: Role) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const user = req.user;

      if (!user || user.role !== role) {
        throw new Error('Unauthorized: invalid token role');
      }

      next();
    } catch (e) {
      next(e);
    }
  };
};

const checkIfTokenRevoked = async (
  _req: Request,
  payload: DecodedToken,
  done: (err: Error | null, revoked: boolean) => void
) => {
  try {
    const { id } = payload;

    const user = await User.findById(id);

    if (!user || !user.updatedAt) {
      return done(null, !user);
    }

    const updateDateEpoch = user.updatedAt.getTime();

    // check if token has been issued before user update. iat is seconds from epoch, so multiply by 1000
    return done(null, payload.iat * 1000 <= updateDateEpoch);
  } catch (e) {
    logger.log('error with jwt token verifying:', e);
  }
};

export const verifyToken = expressJwt({
  secret: config.SECRET,
  isRevoked: checkIfTokenRevoked,
});
