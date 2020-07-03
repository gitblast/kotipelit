import { CommonEvent, PlayerEvent } from '../types';
import { attachListeners } from './socketio';

export const connect = (
  socket: SocketIOClient.Socket,
  token: string,
  isHost: boolean
) => {
  return () => {
    socket
      .emit(CommonEvent.AUTH_REQUEST, { token })
      .on(CommonEvent.AUTHENTICATED, () => {
        attachListeners(socket, isHost);
        socket.emit(PlayerEvent.JOIN_GAME);
      })
      .on(CommonEvent.UNAUTHORIZED, (error: { message: string }) => {
        throw new Error(error.message);
      });
  };
};

export const playerJoined = () => () => console.log('todo');

export const createSuccess = () => () => console.log('todo');
export const createFailure = () => () => console.log('todo');

export const startSuccess = () => () => console.log('todo');
export const startFailure = () => () => console.log('todo');

export const joinSuccess = () => () => console.log('todo');
export const joinFailure = () => () => console.log('todo');

export const gameReady = () => () => console.log('todo');
export const gameStarting = () => () => console.log('todo');
