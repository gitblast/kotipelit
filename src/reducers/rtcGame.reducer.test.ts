import reducer, { setGame } from './rtcGame.reducer';

import { RTCGame, RTCGameAction, RTCInitGamePayload } from '../types';

jest.mock('../store');

describe('rtc game reducer', () => {
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

  it('should handle INIT_GAME', () => {
    const initialState = {
      initialSelf: { self: true },
      initialGame: { game: true },
      initialPeers: { peers: true },
    };

    const action: RTCGameAction = {
      type: 'INIT_GAME',
      payload: (initialState as unknown) as RTCInitGamePayload,
    };

    const expectedState = initialState.initialGame;

    expect(reducer(undefined, action)).toBe(expectedState);
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
