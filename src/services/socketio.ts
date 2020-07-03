import axios from 'axios';
import { CommonEvent, HostEvent, PlayerEvent } from '../types';
import * as callbacks from './socketio.callbacks';

export const attachListeners = (
  socket: SocketIOClient.Socket,
  isHost: boolean
) => {
  // default listeners

  socket.on(CommonEvent.PLAYER_JOINED, callbacks.playerJoined());

  if (isHost) {
    // host listeners

    socket.on(HostEvent.CREATE_SUCCESS, callbacks.createSuccess());
    socket.on(HostEvent.CREATE_FAILURE, callbacks.createFailure());

    socket.on(HostEvent.START_SUCCESS, callbacks.startSuccess());
    socket.on(HostEvent.START_FAILURE, callbacks.startFailure());
  } else {
    // player listeners

    socket.on(PlayerEvent.JOIN_SUCCESS, callbacks.joinSuccess());
    socket.on(PlayerEvent.JOIN_FAILURE, callbacks.joinFailure());

    socket.on(PlayerEvent.GAME_READY, callbacks.gameReady());
    socket.on(PlayerEvent.GAME_STARTING, callbacks.gameStarting());
  }
};

const getTokenForSocket = async (
  gameId: string,
  playerId: string
): Promise<string> => {
  const response = await axios.get(`/api/games/${gameId}?pelaaja=${playerId}`);
  return response.data;
};

const authenticateSocket = (
  socket: SocketIOClient.Socket,
  token: string,
  isHost: boolean
): SocketIOClient.Socket => {
  socket.on(CommonEvent.CONNECT, callbacks.connect(socket, token, isHost));

  return socket;
};

//const initSocket = () => {};

export default {
  getTokenForSocket,
  authenticateSocket,
};
