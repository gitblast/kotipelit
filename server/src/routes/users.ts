import { onlyForRole } from '../utils/middleware';

import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user';
import mailService from '../services/mail';
import authService from '../services/auth';

import { toAuthenticatedUser, toNewUser, parseString } from '../utils/mappers';
import { NewUser, Role } from '../types';
import logger from '../utils/logger';
import userService from '../services/users';
import jwt from 'jsonwebtoken';
import config from '../utils/config';
import { verifyToken } from '../utils/middleware';

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const allUsers = await User.find({});
    res.json(allUsers);
  } catch (error) {
    next(error);
  }
});

router.get('/verify/:confirmationId', async (req, res, next) => {
  try {
    const confirmationId = parseString(req.params.confirmationId);

    const verifiedUser = await userService.verifyUser(confirmationId);

    logger.log(`verified user '${verifiedUser.username}'`);

    const userForToken = {
      username: verifiedUser.username,
      id: verifiedUser._id.toString(),
      role: Role.HOST,
    };

    const token = jwt.sign(userForToken, config.SECRET);

    res.json({ token, username: verifiedUser.username });
  } catch (e) {
    logger.error(`error verifying email: ${e.message}`);

    next(e);
  }
});

router.get('/validate', async (req, res, next) => {
  try {
    const username = req.query.username;

    if (username) {
      const usernameAvailable = await userService.checkUsernameAvailability(
        username as string
      );

      if (usernameAvailable) {
        return res.json(usernameAvailable);
      } else {
        return res.status(403).send('username not available');
      }
    }

    const email = req.query.email;

    if (email) {
      const emailAvailable = await userService.checkEmailAvailability(
        email as string
      );

      if (emailAvailable) {
        return res.json(emailAvailable);
      } else {
        return res.status(403).send('email not available');
      }
    }

    throw new Error('no params provided to validate');
  } catch (e) {
    logger.error(`error validating: ${e.message}`);

    return next(e);
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

    logger.log(`user '${newUser.username}' created`);

    res.json(savedUser);

    await mailService.sendVerification(
      newUser.email,
      newUser.confirmationId,
      newUser.username
    );
  } catch (error) {
    next(error);
  }
});

router.post('/requestPasswordReset', async (req, res) => {
  try {
    const email = parseString(req.body.email, 'email');

    await authService.requestPasswordReset(email);
  } catch (e) {
    logger.error(`error with password reset request: ${e.message}`);
  }

  /** send same result whether succesful or not */
  res.status(204).send();
});

router.post('/resetPassword', async (req, res, next) => {
  try {
    const userId = parseString(req.body.userId, 'userId');
    const token = parseString(req.body.token, 'resetToken');
    const newPassword = parseString(req.body.password, 'newPassword');

    await authService.resetPassword(userId, token, newPassword);

    res.status(204).send();
  } catch (e) {
    logger.error(`error reseting password: ${e.message}`);

    next(e);
  }
});

/** token only */
router.use(verifyToken, onlyForRole(Role.HOST));

router.post('/changePassword', async (req, res, next) => {
  try {
    const user = toAuthenticatedUser(req);
    const newPassword = parseString(req.body.newPassword, 'newPassword');
    const oldPassword = parseString(req.body.oldPassword, 'oldPassword');

    await authService.changePassword(
      user.id.toString(),
      oldPassword,
      newPassword
    );

    res.status(204).send();
  } catch (e) {
    logger.error(`error changing password: ${e.message}`);

    next(e);
  }
});

export default router;
