import reducer, { initGame, initRTCGame, setGame } from './rtcGame.reducer';
import kotitonniLocalReducer from './kotitonni.local.reducer';

import {
  GameType,
  RTCGame,
  RTCGameAction,
  RTCGameRoom,
  RTCInitGamePayload,
  RTCPeer,
  RTCSelf,
} from '../types';
import { injectLocalDataReducer } from '../store';
import Peer from 'peerjs';

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

  describe('thunk actions', () => {
    describe('initRTCGame', () => {
      const injectLocalDataReducerMock = (injectLocalDataReducer as unknown) as jest.Mock;
      const dispatch = jest.fn();

      beforeEach(() => {
        dispatch.mockClear();
      });

      const mockRoom = {
        game: {
          type: GameType.KOTITONNI,
          players: [
            {
              id: 'playerId',
            },
            {
              id: 'other',
            },
          ],
          info: {
            turn: 'playerId',
          },
        },
        players: [
          {
            id: 'playerId',
            peerId: 'peerId',
          },
          {
            id: 'other',
            peerId: 'other',
          },
        ],
        host: {
          id: 'host',
          peerId: 'hostPeerId',
        },
      };

      const mockSocket = ({
        socket: true,
        id: 'socketId',
      } as unknown) as SocketIOClient.Socket;
      const mockPeerClient = ({
        peerClient: true,
        id: 'ownPeerClientId',
      } as unknown) as Peer;

      it('should inject local data reducer for kotitonni', () => {
        initRTCGame(
          (mockRoom as unknown) as RTCGameRoom,
          mockSocket,
          mockPeerClient
        )(dispatch);

        expect(injectLocalDataReducerMock).toHaveBeenLastCalledWith(
          kotitonniLocalReducer
        );
      });

      it('should not dispatch if self object is not found', () => {
        initRTCGame(
          (mockRoom as unknown) as RTCGameRoom,
          mockSocket,
          mockPeerClient
        )(dispatch);

        expect(dispatch).not.toHaveBeenCalled();
      });

      it('should find self -object for players', () => {
        const playersWithSelf = [
          {
            peerId: 'ownPeerClientId',
          },
        ];

        initRTCGame(
          ({ ...mockRoom, players: playersWithSelf } as unknown) as RTCGameRoom,
          mockSocket,
          mockPeerClient
        )(dispatch);

        expect(dispatch).toHaveBeenCalled();
      });

      it('should find self -object for host', () => {
        const hostAsSelf = {
          peerId: 'ownPeerClientId',
        };

        initRTCGame(
          ({ ...mockRoom, host: hostAsSelf } as unknown) as RTCGameRoom,
          mockSocket,
          mockPeerClient
        )(dispatch);

        expect(dispatch).toHaveBeenCalled();
      });

      it('should dispatch initial self peers and game', () => {
        const mockSelf = {
          peerId: 'ownPeerClientId',
        };

        initRTCGame(
          ({ ...mockRoom, host: mockSelf } as unknown) as RTCGameRoom,
          mockSocket,
          mockPeerClient
        )(dispatch);

        const expectedSelf = ({
          ...mockSelf,
          peer: mockPeerClient,
          socket: mockSocket,
          stream: null,
        } as unknown) as RTCSelf;

        const expectedPeers = [
          {
            id: 'playerId',
            peerId: 'peerId',
            call: null,
            stream: null,
            isMe: false,
          },
          {
            id: 'other',
            peerId: 'other',
            call: null,
            stream: null,
            isMe: false,
          },
          {
            ...mockSelf,
            stream: null,
            call: null,
            isMe: true,
          },
        ] as RTCPeer[];

        const expectedGame = {
          ...mockRoom.game,
          players: [
            {
              id: 'playerId',
              hasTurn: true,
            },
            {
              id: 'other',
              hasTurn: false,
            },
          ],
        } as RTCGame;

        expect(dispatch).toHaveBeenCalledWith(
          initGame(expectedPeers, expectedSelf, expectedGame)
        );
      });
    });
  });
});
