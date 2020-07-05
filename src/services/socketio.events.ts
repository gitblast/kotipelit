import {
  EventType,
  BroadcastedEvent,
  EmittedEvent,
  ReturnedGame,
} from '../types';

export const createSuccess = (
  game: ReturnedGame,
  jitsiToken: string
): EmittedEvent => ({
  event: EventType.CREATE_SUCCESS,
  data: {
    game,
    jitsiToken,
  },
});

export const createFailure = (message: string): EmittedEvent => ({
  event: EventType.CREATE_FAILURE,
  data: { error: message },
});

export const startSuccess = (game: ReturnedGame): EmittedEvent => ({
  event: EventType.START_SUCCESS,
  data: game,
});

export const startFailure = (message: string): EmittedEvent => ({
  event: EventType.START_FAILURE,
  data: { error: message },
});

export const joinSuccess = (
  game: ReturnedGame,
  jitsiRoom: string
): EmittedEvent => ({
  event: EventType.JOIN_SUCCESS,
  data: {
    game,
    jitsiRoom,
  },
});

export const joinFailure = (message: string): EmittedEvent => ({
  event: EventType.JOIN_FAILURE,
  data: { error: message },
});

export const gameReady = (jitsiRoom: string): BroadcastedEvent => ({
  event: EventType.GAME_READY,
  data: jitsiRoom,
});

export const playerJoined = (id: string): BroadcastedEvent => ({
  event: EventType.PLAYER_JOINED,
  data: id,
});

export const gameStarting = (game: ReturnedGame): BroadcastedEvent => ({
  event: EventType.GAME_STARTING,
  data: game,
});
