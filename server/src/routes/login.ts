import express from 'express';

import { toCredentials } from '../utils/mappers';

import authService from '../services/auth';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { usernameOrEmail, password } = toCredentials(req.body);

    const loginData = await authService.login(usernameOrEmail, password);

    res.json(loginData);
  } catch (error) {
    next(error);
  }
});

export default router;
