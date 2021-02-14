import axios from 'axios';

import userService from './users';
import { GamePlayer, LobbyGame, ReservationResponse, RTCGame } from '../types';

const baseUrl = '/api/games';

const getAll = async (): Promise<RTCGame[]> => {
  const config = {
    headers: { Authorization: userService.getAuthHeader() },
  };

  const response = await axios.get(baseUrl, config);

  return response.data;
};

const addNew = async (
  gameToAdd: Omit<RTCGame, 'id' | 'host' | 'info'>
): Promise<RTCGame> => {
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

const reserveSpotForGame = async (
  reservationId: string,
  gameId: string
): Promise<ReservationResponse> => {
  const data = {
    gameId,
    reservationId,
  };

  const response = await axios.put(`${baseUrl}/reserve`, data);

  return response.data;
};

const lockSpotForGame = async (
  reservationId: string,
  gameId: string,
  displayName: string,
  email: string
): Promise<GamePlayer> => {
  const data = {
    gameId,
    reservationId,
    displayName,
    email,
  };

  const response = await axios.put(`${baseUrl}/lock`, data);

  return response.data;
};

const getLobbyGame = async (
  hostName: string,
  id: string
): Promise<LobbyGame> => {
  const response = await axios.get(`${baseUrl}/lobby/${hostName}/${id}`);

  return response.data;
};

const cancelReservation = async (hostName: string, inviteCode: string) => {
  try {
    await axios.get(`${baseUrl}/cancel/${hostName}/${inviteCode}`);

    return true;
  } catch (e) {
    return false;
  }
};

export default {
  getAll,
  addNew,
  deleteGame,
  getHostTokenForGame,
  getPlayerTokenForGame,
  reserveSpotForGame,
  getLobbyGame,
  lockSpotForGame,
  cancelReservation,
};
