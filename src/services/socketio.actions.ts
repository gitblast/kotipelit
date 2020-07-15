import store from '../store';
import { emit } from './socketio';
import * as events from './socketio.events';
import { ActiveGame } from '../types';

export const emitJitsiReady = (gameId: string, jitsiRoom: string): void => {
  try {
    const socket = store.getState().user.socket;

    if (!socket) throw new Error('Socket not set for user');

    emit(socket, events.jitsiReady(gameId, jitsiRoom));
  } catch (error) {
    console.error(error.message);
  }
};

export const startGame = (gameId: string): void => {
  try {
    const socket = store.getState().user.socket;

    if (!socket) throw new Error('Socket not set for user');

    emit(socket, events.startGame(gameId));
  } catch (error) {
    console.error(error.message);
  }
};

export const updateGame = (game: ActiveGame) => {
  try {
    const socket = store.getState().user.socket;

    if (!socket) throw new Error('Socket not set for user');

    emit(socket, events.updateGame(game));
  } catch (error) {
    console.error(error.message);
  }
};
