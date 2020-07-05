import { emit } from './socketio';
import * as events from './socketio.events';
import store from '../store';
import { ActiveGame } from '../types';
import { setActiveGame } from '../reducers/games.reducer';

export const emitJitsiReady = (
  socket: SocketIOClient.Socket,
  gameId: string,
  jitsiRoom: string
): void => {
  emit(socket, events.jitsiReady(gameId, jitsiRoom));
};

export const startGame = (
  socket: SocketIOClient.Socket,
  gameId: string
): void => {
  emit(socket, events.startGame(gameId));
};

export const updateGame = (socket: SocketIOClient.Socket, game: ActiveGame) => {
  store.dispatch(setActiveGame(game));
  emit(socket, events.updateGame(game));
};
