import User, { UserModel } from '../models/user';
import bcrypt from 'bcryptjs';
import { NewUser } from '../types';

const usersInDb = async (): Promise<UserModel[]> => {
  return await User.find({});
};

const addDummyUser = async (
  username: string = Date.now().toString(),
  password: string = Date.now().toString()
): Promise<UserModel> => {
  const newUser: NewUser = {
    username,
    password,
    email: username + Date.now().toString(),
    channelName: username + Date.now().toString(),
  };

  const passwordHash = await bcrypt.hash(newUser.password, 10);

  const user = new User({
    username: newUser.username,
    email: newUser.email,
    channelName: newUser.channelName,
    passwordHash,
    joinDate: new Date(),
  });

  return await user.save();
};
export default {
  usersInDb,
  addDummyUser,
};
