/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import config from '../utils/config';
import { toCredentials } from '../utils/mappers';

import User from '../models/user';
import { Role } from '../types';

const router = express.Router();

router.post('/', async (req, res) => {
  const { username, password } = toCredentials(req.body);

  const user = await User.findOne({ username });
  const pwCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!user || !pwCorrect) throw new Error('Invalid username or password');

  const userForToken = {
    username,
    id: user._id.toString(),
    role: Role.HOST,
  };

  const token = jwt.sign(userForToken, config.SECRET);

  res.json({ token, username });
});

export default router;
