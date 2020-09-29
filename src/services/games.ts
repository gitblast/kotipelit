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

const getHostTokenForGame = async (gameId: string): Promise<string> => {
  const config = {
    headers: { Authorization: userService.getAuthHeader() },
  };

  const response = await axios.get(`${baseUrl}/token/${gameId}`, config);

  return response.data;
};

const getPlayerTokenForGame = async (
  username: string,
  playerId: string,
  rtc?: boolean
): Promise<string> => {
  const response = await axios.get(
    `/api/games/join/${username}/${playerId}${rtc ? '/?rtc=true' : ''}`
  );

  return response.data;
};

export default {
  getAll,
  addNew,
  deleteGame,
  getHostTokenForGame,
  getPlayerTokenForGame,
};
