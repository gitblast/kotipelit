import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import config from '../utils/config';
import { toCredentials } from '../utils/mappers';

import User from '../models/user';
import { Role, UserToken } from '../types';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { usernameOrEmail, password } = toCredentials(req.body);

    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!user) {
      throw new Error('Invalid username or password');
    }

    if (user.status !== 'active') {
      throw new Error('Email not verified');
    }

    const pwCorrect = await bcrypt.compare(password, user.passwordHash);

    if (!pwCorrect) {
      throw new Error('Invalid username or password');
    }

    const userForToken: UserToken = {
      username: user.username,
      id: user._id.toString(),
      role: Role.HOST,
    };

    const token = jwt.sign(userForToken, config.SECRET);

    res.json({ token, username: user.username });
  } catch (error) {
    next(error);
  }
});

export default router;
