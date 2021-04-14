import User from '../models/user';

const getUserById = async (id: string) => {
  const user = await User.findById(id);

  if (!user) {
    throw new Error(`Invalid request: no user found with id '${id}'`);
  }

  return user;
};

const getUserByUsername = async (username: string) => {
  const user = await User.findOne({ username });

  if (!user) {
    throw new Error(
      `Invalid request: no user found with username '${username}'`
    );
  }

  return user;
};

const checkUsernameAvailability = async (username: string) => {
  const user = await User.findOne({ username });

  return !user;
};

const checkEmailAvailability = async (email: string) => {
  const user = await User.findOne({ email });

  return !user;
};

const verifyUser = async (confirmationId: string) => {
  const user = await User.findOne({ confirmationId });

  if (!user) {
    throw new Error(`no user found with confirmation id '${confirmationId}'`);
  }

  user.status = 'active';

  return await user.save();
};

export default {
  getUserById,
  getUserByUsername,
  checkUsernameAvailability,
  checkEmailAvailability,
  verifyUser,
};
