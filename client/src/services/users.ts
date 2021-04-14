import axios from 'axios';

import { LoggedUser, HostChannel, UserToAdd } from '../types';

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

const addNew = async (newUser: UserToAdd) => {
  const response = await axios.post(baseUrl, newUser);

  return response.data;
};

const checkAvailability = async (fieldName: string, value: string) => {
  const response = await axios.get(
    `${baseUrl}/validate/?${fieldName}=${value}`
  );

  return response.data;
};

const verifyConfirmationId = async (confirmationId: string) => {
  const response = await axios.get(`${baseUrl}/verify/${confirmationId}`);

  return response.data;
};

const userService = {
  addNew,
  login,
  setToken,
  getAuthHeader,
  getAll,
  getToken,
  checkAvailability,
  verifyConfirmationId,
};

export default userService;
