import { HostEvent, EmittedEvent, PlayerEvent, ActiveGame } from '../../types';

export const createRoom = (gameId: string): EmittedEvent => ({
  event: HostEvent.CREATE_ROOM,
  data: gameId,
});

export const joinGame = (): EmittedEvent => ({
  event: PlayerEvent.JOIN_GAME,
  data: null,
});

export const jitsiReady = (
  gameId: string,
  jitsiRoom: string
): EmittedEvent => ({
  event: HostEvent.JITSI_READY,
  data: { gameId, jitsiRoom },
});

export const startGame = (gameId: string): EmittedEvent => ({
  event: HostEvent.START_GAME,
  data: gameId,
});

export const updateGame = (game: ActiveGame): EmittedEvent => ({
  event: HostEvent.UPDATE_GAME,
  data: game,
});
