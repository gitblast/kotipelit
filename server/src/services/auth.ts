import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import User from '../models/user';
import Token from '../models/token';
import { Role, UserToken } from '../types';
import mailService from '../services/mail';

import config from '../utils/config';
import logger from '../utils/logger';

const login = async (usernameOrEmail: string, password: string) => {
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

  return { token, username: user.username };
};

const requestPasswordReset = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error(`No user found with given email`);
  }

  const userId = user._id.toString();

  const token = await Token.findOne({ userId });

  /** if an old token already exist, delete it */
  if (token) {
    await token.deleteOne();
  }

  const resetToken = crypto.randomBytes(32).toString('hex');

  const hash = await bcrypt.hash(resetToken, 10);

  await new Token({
    userId,
    token: hash,
    createdAt: Date.now(),
  }).save();

  await mailService.sendPasswordResetEmail(
    user.email,
    user.username,
    userId,
    resetToken
  );
};

const resetPassword = async (
  userId: string,
  token: string,
  newPassword: string
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error(`Invalid request: no user found`);
  }

  const resetToken = await Token.findOne({ userId });

  if (!resetToken) {
    throw new Error(`Invalid or expired password reset token`);
  }

  const isValid = await bcrypt.compare(token, resetToken.token);

  if (!isValid) {
    throw new Error(`Invalid or expired password reset token`);
  }

  const newHash = await bcrypt.hash(newPassword, 10);

  user.passwordHash = newHash;

  await user.save();

  await resetToken.deleteOne();

  logger.log(`password reset for user '${user.username}' succesful`);

  await mailService.sendPasswordChangeConfirmation(user.email, user.username);
};

const changePassword = async (userId: string, newPassword: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error(`Invalid request: no user found`);
  }

  const newHash = await bcrypt.hash(newPassword, 10);

  user.passwordHash = newHash;

  await user.save();

  logger.log(`password change for user '${user.username}' succesful`);

  await mailService.sendPasswordChangeConfirmation(user.email, user.username);
};

export default {
  login,
  requestPasswordReset,
  resetPassword,
  changePassword,
};
