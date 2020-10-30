import {
  EventType,
  BroadcastedEvent,
  EmittedEvent,
  ActiveGame,
} from '../../types';

export const createSuccess = (
  game: ActiveGame,
  jitsiToken: string,
  jitsiRoom: string
): EmittedEvent => ({
  event: EventType.CREATE_SUCCESS,
  data: {
    game,
    jitsiToken,
    jitsiRoom,
  },
});

export const createFailure = (message: string): EmittedEvent => ({
  event: EventType.CREATE_FAILURE,
  data: { error: message },
});

export const startSuccess = (game: ActiveGame): EmittedEvent => ({
  event: EventType.START_SUCCESS,
  data: game,
});

export const startFailure = (message: string): EmittedEvent => ({
  event: EventType.START_FAILURE,
  data: { error: message },
});

export const joinSuccess = (
  game: ActiveGame,
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

export const updateSuccess = (game: ActiveGame): EmittedEvent => ({
  event: EventType.UPDATE_SUCCESS,
  data: game,
});

export const updateFailure = (message: string): EmittedEvent => ({
  event: EventType.UPDATE_FAILURE,
  data: { error: message },
});

export const endSuccess = (gameId: string): EmittedEvent => ({
  event: EventType.END_SUCCESS,
  data: gameId,
});

export const endFailure = (message: string): EmittedEvent => ({
  event: EventType.END_FAILURE,
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

export const gameStarting = (game: ActiveGame): BroadcastedEvent => ({
  event: EventType.GAME_STARTING,
  data: game,
});

export const gameUpdated = (game: ActiveGame): BroadcastedEvent => ({
  event: EventType.GAME_UPDATED,
  data: game,
});

export const gameEnded = (): BroadcastedEvent => ({
  event: EventType.GAME_ENDED,
  data: null,
});
