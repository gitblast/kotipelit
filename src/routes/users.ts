import express from 'express';
import bcrypt from 'bcryptjs';

import User from '../models/user';

import { toNewUser } from '../utils/mappers';
import { NewUser } from '../types';

const router = express.Router();

/** @TODO protect routes */

router.get('/', async (_req, res) => {
  const allUsers = await User.find({});
  res.json(allUsers);
});

/** @TODO handle duplicate fields with existing users */

router.post('/', async (req, res, next) => {
  const newUser: NewUser = toNewUser(req.body);

  const passwordHash = await bcrypt.hash(newUser.password, 10);

  const user = new User({
    username: newUser.username,
    email: newUser.email,
    channelName: newUser.channelName,
    passwordHash,
    joinDate: new Date(),
  });

  try {
    const savedUser = await user.save();
    res.json(savedUser);
  } catch (error) {
    next(error);
  }
});

export default router;
