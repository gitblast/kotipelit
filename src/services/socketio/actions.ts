import socketIO from 'socket.io-client';
import store from '../../store';
import socketService from './service';
import * as events from './events';
import { ActiveGame, LoggedUser } from '../../types';

export const emitJitsiReady = (gameId: string, jitsiRoom: string): void => {
  try {
    const socket = store.getState().user.socket;

    if (!socket) throw new Error('Socket not set for user');

    socketService.emit(socket, events.jitsiReady(gameId, jitsiRoom));
  } catch (error) {
    console.error(error.message);
  }
};

export const startGame = (gameId: string): void => {
  try {
    const socket = store.getState().user.socket;

    if (!socket) throw new Error('Socket not set for user');

    socketService.emit(socket, events.startGame(gameId));
  } catch (error) {
    console.error(error.message);
  }
};

export const updateGame = (game: ActiveGame) => {
  try {
    const socket = store.getState().user.socket;

    if (!socket) throw new Error('Socket not set for user');

    socketService.emit(socket, events.updateGame(game));
  } catch (error) {
    console.error(error.message);
  }
};

export const getAuthCallback = (gameId: string | null): Function => {
  if (gameId) {
    return (socket: SocketIOClient.Socket) => {
      socketService.attachListeners(socket, true);
      socketService.emit(socket, events.createRoom(gameId));
    };
  }

  return (socket: SocketIOClient.Socket) => {
    socketService.attachListeners(socket, false);
    socketService.emit(socket, events.joinGame());
  };
};

export const initHostSocket = (
  user: LoggedUser,
  gameId: string
): SocketIOClient.Socket => {
  if (!gameId) throw new Error(`Pelin id puuttuu`);

  return socketService.authenticateSocket(
    socketIO(),
    user.token,
    getAuthCallback(gameId)
  );
};

export const initPlayerSocket = async (
  gameId: string,
  playerId: string | null
): Promise<SocketIOClient.Socket> => {
  if (!playerId) throw new Error('Pelaajan id puuttuu');

  const token = await socketService.getTokenForSocket(gameId, playerId);

  return socketService.authenticateSocket(
    socketIO(),
    token,
    getAuthCallback(null)
  );
};
