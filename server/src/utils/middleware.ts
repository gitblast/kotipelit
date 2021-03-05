import { Request, Response, NextFunction } from 'express';
import { Role } from '../types';

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
