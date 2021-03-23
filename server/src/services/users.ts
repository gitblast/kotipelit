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

export default { getUserById, getUserByUsername };
