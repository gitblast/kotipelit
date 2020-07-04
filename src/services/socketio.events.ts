import { HostEvent, EmittedEvent, PlayerEvent } from '../types';

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
