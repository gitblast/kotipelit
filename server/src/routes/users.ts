import express from 'express';
import bcrypt from 'bcryptjs';
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

router.post('/', async (req, res, next) => {
  try {
    const newUser: NewUser = toNewUser(req.body);

    const passwordHash = await bcrypt.hash(newUser.password, 10);

    const user = new User({
      ...newUser,
      passwordHash,
      joinDate: new Date(),
    });

    const savedUser = await user.save();

    res.json(savedUser);
  } catch (error) {
    next(error);
  }
});

export default router;
