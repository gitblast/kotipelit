import axios from 'axios';

import { UserToAdd } from '../types';

const baseUrl = '/api/users';
let token: string | null = null;

const login = async (username: string, password: string) => {
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

const getAll = async () => {
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

const resetPassword = async (
  newPassword: string,
  token: string,
  userId: string
) => {
  const data = {
    password: newPassword,
    token,
    userId,
  };

  await axios.post(`${baseUrl}/resetPassword`, data);
};

const requestPasswordReset = async (email: string) => {
  await axios.post(`${baseUrl}/requestPasswordReset`, { email });
};

const changePassword = async (newPassword: string, oldPassword: string) => {
  const config = {
    headers: { Authorization: getAuthHeader() },
  };

  await axios.post(
    `${baseUrl}/changePassword`,
    { newPassword, oldPassword },
    config
  );
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
  resetPassword,
  requestPasswordReset,
  changePassword,
};

export default userService;
