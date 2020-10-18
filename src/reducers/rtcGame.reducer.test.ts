import reducer, { setGame } from './rtcGame.reducer';

import { RTCGame, RTCGameAction } from '../types';

describe('local data reducer', () => {
  it('should return initial state null', () => {
    expect(reducer(undefined, {} as RTCGameAction)).toBeNull();
  });

  it('should handle SET_GAME', () => {
    const action: RTCGameAction = {
      type: 'SET_GAME',
      payload: {} as RTCGame,
    };

    const expectedState = action.payload;

    expect(reducer(undefined, action)).toEqual(expectedState);
  });

  describe('action creators', () => {
    it('should return an action for SET_GAME with setGame', () => {
      const game = {} as RTCGame;

      const expectedAction: RTCGameAction = {
        type: 'SET_GAME',
        payload: game,
      };

      expect(setGame(game)).toEqual(expectedAction);
    });
  });
});
