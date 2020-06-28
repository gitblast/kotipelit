import axios from 'axios';

import userService from './users';
import { SelectableGame } from '../types';

const baseUrl = '/api/games';

const getAll = async (): Promise<SelectableGame[]> => {
  const config = {
    headers: { Authorization: userService.getAuthHeader() },
  };

  const response = await axios.get(baseUrl, config);

  return response.data;
};

const addNew = async (
  gameToAdd: Omit<SelectableGame, 'id'>
): Promise<SelectableGame> => {
  const config = {
    headers: { Authorization: userService.getAuthHeader() },
  };

  const response = await axios.post(baseUrl, gameToAdd, config);

  return response.data;
};

const deleteGame = async (id: string): Promise<void> => {
  const config = {
    headers: { Authorization: userService.getAuthHeader() },
  };

  await axios.delete(`${baseUrl}/${id}`, config);
};

export default {
  getAll,
  addNew,
  deleteGame,
};
