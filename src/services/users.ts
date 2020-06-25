import axios from 'axios';

import { LoggedUser } from '../types';

const login = async (
  username: string,
  password: string
): Promise<LoggedUser> => {
  const credentials = { username, password };

  const response = await axios.post('api/login', credentials);
  return response.data;
};

export default {
  login,
};
