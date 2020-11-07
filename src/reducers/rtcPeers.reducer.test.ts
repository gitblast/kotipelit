import reducer, { setPeers, userLeft } from './rtcPeers.reducer';

import { RTCPeer, RTCPeersAction, RTCInitGamePayload } from '../types';

describe('rtc peers reducer', () => {
  it('should return initial state null', () => {
    expect(reducer(undefined, {} as RTCPeersAction)).toBeNull();
  });

  it('should handle SET_PEERS', () => {
    const action: RTCPeersAction = {
      type: 'SET_PEERS',
      payload: [] as RTCPeer[],
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

    const action: RTCPeersAction = {
      type: 'INIT_GAME',
      payload: (initialState as unknown) as RTCInitGamePayload,
    };

    const expectedState = initialState.initialPeers;

    expect(reducer(undefined, action)).toBe(expectedState);
  });

  describe('action creators', () => {
    it('should return an action for SET_GAME with setGame', () => {
      const peers = [] as RTCPeer[];

      const expectedAction: RTCPeersAction = {
        type: 'SET_PEERS',
        payload: peers,
      };

      expect(setPeers(peers)).toEqual(expectedAction);
    });
  });

  describe('thunk actions', () => {
    const getState = jest.fn();
    const dispatch = jest.fn();

    describe('userLeft', () => {
      it('should call getState', () => {
        getState.mockReturnValueOnce({ rtc: {} });

        userLeft('id')(dispatch, getState);

        expect(getState).toHaveBeenCalledTimes(1);
      });

      it('should set peer matching id properties to null and dispatch', () => {
        const mockPeers = [
          {
            id: 'MATCH',
            socketId: 'exists',
            peerId: 'exists',
            call: {},
            stream: {},
          },
          {
            id: 'NOT_A_MATCH',
            socketId: 'exists',
            peerId: 'exists',
            call: {},
            stream: {},
          },
        ];

        const expectedPeers = [
          {
            id: 'MATCH',
            socketId: null,
            peerId: null,
            call: null,
            stream: null,
          },
          {
            id: 'NOT_A_MATCH',
            socketId: 'exists',
            peerId: 'exists',
            call: {},
            stream: {},
          },
        ];

        getState.mockReturnValueOnce({ rtc: { peers: mockPeers } });

        userLeft('MATCH')(dispatch, getState);

        expect(dispatch).toHaveBeenCalledWith(
          setPeers(expectedPeers as RTCPeer[])
        );
      });
    });
  });
});
