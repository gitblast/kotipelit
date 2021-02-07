import reducer, {
  setPeers,
  setStreamForPeer,
  userJoined,
  userLeft,
  callPeers,
} from './rtcPeers.reducer';

import { RTCPeer, RTCPeersAction, RTCInitGamePayload } from '../types';
import { MediaConnection } from 'peerjs';
import callHelpers from '../helpers/call';

jest.mock('../helpers/call');

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

    beforeEach(() => {
      getState.mockClear();
      dispatch.mockClear();
    });

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

    describe('userJoined', () => {
      it('should call getState', () => {
        getState.mockReturnValueOnce({ rtc: {} });

        userJoined({} as RTCPeer)(dispatch, getState);

        expect(getState).toHaveBeenCalledTimes(1);
      });

      it('should dispatch peers with new user set', () => {
        const mockPeers = [
          {
            id: 'MATCH',
            socketId: 'initial',
            peerId: 'initial',
            call: { initial: true },
            stream: { initial: true },
          },
          {
            id: 'NOT_A_MATCH',
            socketId: 'exists',
            peerId: 'exists',
            call: {},
            stream: {},
          },
        ];

        const newUser = {
          id: 'MATCH',
          socketId: 'newuser',
          peerId: 'newuser',
        } as RTCPeer;

        const expectedPeers = [
          {
            id: 'MATCH',
            socketId: newUser.socketId,
            peerId: newUser.peerId,
            call: mockPeers[0].call,
            stream: mockPeers[0].stream,
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

        userJoined(newUser)(dispatch, getState);

        expect(dispatch).toHaveBeenLastCalledWith(
          setPeers(expectedPeers as RTCPeer[])
        );
      });
    });

    describe('callPeers', () => {
      it('should do nothing if peers, peerclient or stream is not set', () => {
        const noPeersState = {
          rtc: {
            self: {
              peer: { mock: true },
              stream: { stream: true },
            },
            peers: null,
          },
        };

        getState.mockReturnValue(noPeersState);

        callPeers()(dispatch, getState);

        expect(dispatch).not.toHaveBeenCalled();

        const noStreamSet = {
          rtc: {
            self: {
              peer: { mock: true },
              stream: null,
            },
            peers: [
              {
                id: 'peer',
              },
            ],
          },
        };

        getState.mockReturnValue(noStreamSet);

        callPeers()(dispatch, getState);

        expect(dispatch).not.toHaveBeenCalled();

        const noPeerSet = {
          rtc: {
            self: {
              peer: null,
              stream: { mock: true },
            },
            peers: [
              {
                id: 'peer',
              },
            ],
          },
        };

        getState.mockReturnValue(noPeerSet);

        callPeers()(dispatch, getState);

        expect(dispatch).not.toHaveBeenCalled();
      });

      const mockPeerClient = {
        on: jest.fn(),
        call: jest.fn(),
      };

      const mockState = {
        rtc: {
          self: {
            peer: mockPeerClient,
            stream: { mock: true },
          },
          peers: [
            {
              peerId: 'peer1',
            },
            {
              peerId: 'peer2',
            },
            {
              peerId: 'peer3',
            },
          ],
        },
      };

      it('should set listener for calls', () => {
        getState.mockReturnValue(mockState);

        callPeers()(dispatch, getState);

        expect(mockPeerClient.on).toHaveBeenCalledWith(
          'call',
          expect.any(Function)
        );

        const callback = mockPeerClient.on.mock.calls[0][1];

        const mockCall = {
          answer: jest.fn(),
        };

        callback(mockCall);

        expect(mockCall.answer).toHaveBeenCalledWith(mockState.rtc.self.stream);

        expect(callHelpers.attachCallListeners).toHaveBeenCalledWith(
          mockCall,
          expect.any(Function),
          true
        );
      });

      it.skip('should call each peer except self and attach listeners to calls', () => {
        getState.mockReturnValue(mockState);

        mockPeerClient.call.mockImplementation((id: string) => ({
          mockCallWith: id,
        }));

        callPeers()(dispatch, getState);

        // todo: check that callbacks are what they should

        mockState.rtc.peers.forEach((peer) => {
          // fails due to dispatching callPeer for each (and dispatch is mocked out)
          expect(mockPeerClient.call).toHaveBeenCalledWith(
            peer.peerId,
            mockState.rtc.self.stream
          );

          expect(callHelpers.attachCallListeners).toHaveBeenCalledWith(
            { mockCallWith: peer.peerId },
            expect.any(Function)
          );
        });
      });
    });

    describe('setStreamForPeer', () => {
      const mockCall = ({
        call: true,
        peer: 'peerId',
      } as unknown) as MediaConnection;
      const mockStream = ({ stream: true } as unknown) as MediaStream;

      it('should call getState', () => {
        getState.mockReturnValueOnce({ rtc: {} });

        setStreamForPeer(mockCall, mockStream)(dispatch, getState, undefined);

        expect(getState).toHaveBeenCalledTimes(1);
      });

      it('should dispatch peers with call and stream set', () => {
        const mockPeers = [
          {
            peerId: 'peerId',
            call: null,
          },
          {
            peerId: 'other',
            call: null,
          },
        ];

        getState.mockReturnValueOnce({ rtc: { peers: mockPeers } });

        setStreamForPeer(mockCall, mockStream)(dispatch, getState, undefined);

        const expectedPeers = [
          {
            peerId: 'peerId',
            call: mockCall,
            stream: mockStream,
          },
          {
            peerId: 'other',
            call: null,
          },
        ];

        expect(dispatch).toHaveBeenCalledWith(
          setPeers(expectedPeers as RTCPeer[])
        );
      });
    });
  });
});
