import socketIO from 'socket.io-client';
import store from '../../store';
import { setDisplayName, setSocket } from '../../reducers/user.reducer';
import socketService from './service';
import * as events from './events';
import { ActiveGame, LoggedUser } from '../../types';
import { log } from '../../utils/logger';

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

export const endGame = (gameId: string): void => {
  try {
    const socket = store.getState().user.socket;

    if (!socket) throw new Error('Socket not set for user');

    socketService.emit(socket, events.endGame(gameId));
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

export const tearDownSocket = (): void => {
  log('tearing down socket');
  const socket = store.getState().user.socket;

  if (socket) {
    socket.disconnect();
    store.dispatch(setSocket(null));
  }
};

export const initHostSocket = (
  user: LoggedUser,
  gameId: string
): SocketIOClient.Socket => {
  if (!gameId) throw new Error(`Pelin id puuttuu`);

  const socket = socketIO();

  store.dispatch(setSocket(socket));

  return socketService.authenticateSocket(
    socket,
    user.token,
    getAuthCallback(gameId)
  );
};

export const initPlayerSocket = async (
  hostName: string,
  playerId: string
): Promise<SocketIOClient.Socket> => {
  if (!playerId) throw new Error('Pelaajan id puuttuu');

  const data = await socketService.getTokenForSocket(hostName, playerId);

  log(`Setting display name to '${data.displayName}'`);
  store.dispatch(setDisplayName(data.displayName));

  const socket = socketIO();

  store.dispatch(setSocket(socket));

  return socketService.authenticateSocket(
    socket,
    data.token,
    getAuthCallback(null)
  );
};
