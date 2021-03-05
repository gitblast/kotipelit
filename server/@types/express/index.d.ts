import { Role } from '../../src/types';

interface User {
  role: Role;
}

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
