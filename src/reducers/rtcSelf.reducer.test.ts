import reducer, { setSelf, setStream } from './rtcSelf.reducer';

import { RTCInitGamePayload, RTCSelf, RTCSelfAction } from '../types';

describe('rtc self reducer', () => {
  it('should return initial state null', () => {
    expect(reducer(undefined, {} as RTCSelfAction)).toBeNull();
  });

  it('should handle SET_SELF', () => {
    const action: RTCSelfAction = {
      type: 'SET_SELF',
      payload: {} as RTCSelf,
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

    const action: RTCSelfAction = {
      type: 'INIT_GAME',
      payload: (initialState as unknown) as RTCInitGamePayload,
    };

    const expectedState = initialState.initialSelf;

    expect(reducer(undefined, action)).toBe(expectedState);
  });

  it('should handle SET_STREAM', () => {
    const action: RTCSelfAction = {
      type: 'SET_STREAM',
      payload: {} as MediaStream,
    };

    // expect null if self not initiated
    expect(reducer(undefined, action)).toBeNull();

    const initializedState = {} as RTCSelf;

    const expectedState = {
      ...initializedState,
      stream: action.payload,
    };

    expect(reducer(initializedState, action)).toEqual(expectedState);
  });

  describe('action creators', () => {
    it('should return an action for SET_SELF with setSelf', () => {
      const self = {} as RTCSelf;

      const expectedAction: RTCSelfAction = {
        type: 'SET_SELF',
        payload: self,
      };

      expect(setSelf(self)).toEqual(expectedAction);
    });

    it('should return an acton for SET_STREAM with setStream', () => {
      const stream = {} as MediaStream;

      const expectedAction: RTCSelfAction = {
        type: 'SET_STREAM',
        payload: stream,
      };

      expect(setStream(stream)).toEqual(expectedAction);
    });
  });
});
