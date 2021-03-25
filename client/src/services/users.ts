import axios from 'axios';

import { LoggedUser, HostChannel } from '../types';

const baseUrl = '/api/users';
let token: string | null = null;

const login = async (
  username: string,
  password: string
): Promise<Pick<LoggedUser, 'username' | 'token'>> => {
  const credentials = { username, password };

  const response = await axios.post('/api/login', credentials);
  return response.data;
};

const setToken = (userToken: string | null) => {
  token = userToken;
};

const getToken = () => token;

const getAuthHeader = (): string => {
  if (!token) throw new Error('Käyttäjän token puuttuu');

  return `Bearer ${token}`;
};

const getAll = async (): Promise<HostChannel[]> => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const userService = {
  login,
  setToken,
  getAuthHeader,
  getAll,
  getToken,
};

export default userService;
