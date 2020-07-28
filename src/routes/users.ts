import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'express-jwt';

import config from '../utils/config';
import User from '../models/user';

import { toNewUser } from '../utils/mappers';
import { NewUser } from '../types';

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const allUsers = await User.find({});
    res.json(allUsers);
  } catch (error) {
    next(error);
  }
});

router.post(
  '/',
  jwt({ secret: config.ADMIN_SECRET }), // only with admin token
  async (req, res, next) => {
    try {
      const newUser: NewUser = toNewUser(req.body);

      const passwordHash = await bcrypt.hash(newUser.password, 10);

      const user = new User({
        username: newUser.username,
        email: newUser.email,
        channelName: newUser.channelName,
        passwordHash,
        joinDate: new Date(),
      });
      const savedUser = await user.save();
      res.json(savedUser);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
