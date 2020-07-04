import {
  EventType,
  BroadcastedEvent,
  EmittedEvent,
  ActiveGameWithoutSockets,
} from '../types';

export const createSuccess = (jitsiToken: string): EmittedEvent => ({
  event: EventType.CREATE_SUCCESS,
  data: jitsiToken,
});

export const createFailure = (message: string): EmittedEvent => ({
  event: EventType.CREATE_FAILURE,
  data: { error: message },
});

export const startSuccess = (): EmittedEvent => ({
  event: EventType.START_SUCCESS,
  data: null,
});

export const startFailure = (message: string): EmittedEvent => ({
  event: EventType.START_FAILURE,
  data: { error: message },
});

export const joinSuccess = (game: ActiveGameWithoutSockets): EmittedEvent => ({
  event: EventType.JOIN_SUCCESS,
  data: game,
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

export const gameStarting = (): BroadcastedEvent => ({
  event: EventType.GAME_STARTING,
  data: null,
});
