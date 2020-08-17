import * as events from './events';
import { HostEvent, PlayerEvent, ActiveGame } from '../../types';

describe('socket.io events', () => {
  it('should return EmittedEvent -object with createRoom', () => {
    const gameId = 'GAME_ID';

    const obj = events.createRoom(gameId);

    expect(obj).toEqual({
      event: HostEvent.CREATE_ROOM,
      data: gameId,
    });
  });

  it('should return EmittedEvent -object with joinGame', () => {
    const obj = events.joinGame();

    expect(obj).toEqual({
      event: PlayerEvent.JOIN_GAME,
      data: null,
    });
  });

  it('should return EmittedEvent -object with jitsiReady', () => {
    const gameId = 'GAME_ID';
    const jitsiRoom = 'JITSI_ROOM';

    const obj = events.jitsiReady(gameId, jitsiRoom);

    expect(obj).toEqual({
      event: HostEvent.JITSI_READY,
      data: {
        gameId,
        jitsiRoom,
      },
    });
  });

  it('should return EmittedEvent -object with startGame', () => {
    const gameId = 'GAME_ID';

    const obj = events.startGame(gameId);

    expect(obj).toEqual({
      event: HostEvent.START_GAME,
      data: gameId,
    });
  });

  it('should return EmittedEvent -object with endGame', () => {
    const gameId = 'GAME_ID';

    const obj = events.endGame(gameId);

    expect(obj).toEqual({
      event: HostEvent.END_GAME,
      data: gameId,
    });
  });

  it('should return EmittedEvent -object with updateGame', () => {
    const game = {} as ActiveGame;

    const obj = events.updateGame(game);

    expect(obj).toEqual({
      event: HostEvent.UPDATE_GAME,
      data: game,
    });
  });
});
