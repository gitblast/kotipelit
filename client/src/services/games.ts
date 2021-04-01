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

const getSpectatorTokenForGame = async (gameId: string): Promise<string> => {
  const response = await axios.get(`${baseUrl}/spectate/${gameId}`);

  return response.data;
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
  inviteCode: string,
  rtc?: boolean
): Promise<string> => {
  const response = await axios.get(
    `${baseUrl}/join/${username}/${inviteCode}${rtc ? '/?rtc=true' : ''}`
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
  return await axios.get(`${baseUrl}/cancel/${hostName}/${inviteCode}`);
};

const gameService = {
  getAll,
  addNew,
  deleteGame,
  getHostTokenForGame,
  getPlayerTokenForGame,
  getSpectatorTokenForGame,
  reserveSpotForGame,
  getLobbyGame,
  lockSpotForGame,
  cancelReservation,
};

export default gameService;
