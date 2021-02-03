import { MediaConnection } from 'peerjs';
import { Action, Dispatch, Reducer } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import callHelpers from '../helpers/call';
import { RTCPeer, RTCPeersAction, State } from '../types';
import logger from '../utils/logger';

const initialData = null;

const reducer: Reducer<RTCPeer[] | null, RTCPeersAction> = (
  state: RTCPeer[] | null = initialData,
  action: RTCPeersAction
) => {
  switch (action.type) {
    case 'INIT_GAME':
      return action.payload.initialPeers;
    case 'SET_PEERS':
      return action.payload;
    case 'NULLIFY_CONNECTION':
      if (!state) return state;

      return state.map((peerObj) => {
        if (peerObj.peerId === action.payload) {
          peerObj.call?.close();

          return {
            ...peerObj,
            call: null,
            stream: null,
          };
        }

        return peerObj;
      });
    default:
      return state;
  }
};

export const setPeers = (peers: RTCPeer[]): RTCPeersAction => {
  return {
    type: 'SET_PEERS',
    payload: peers,
  };
};

export const nullifyConnection = (id: string): RTCPeersAction => {
  return {
    type: 'NULLIFY_CONNECTION',
    payload: id,
  };
};

export const userLeft = (id: string) => {
  return (dispatch: Dispatch, getState: () => State) => {
    const currentPeers = getState().rtc.peers;

    if (!currentPeers) {
      logger.error('No peers were set when user left!');

      return;
    }

    const newPeers = currentPeers.map((peer) =>
      peer.id === id
        ? { ...peer, socketId: null, peerId: null, call: null, stream: null }
        : peer
    );

    dispatch(setPeers(newPeers));
  };
};

export const userJoined = (newUser: RTCPeer) => {
  return (dispatch: Dispatch, getState: () => State) => {
    const currentPeers = getState().rtc.peers;

    if (!currentPeers) {
      logger.error('No peers were set when user joined!');

      return;
    }

    const newPeers = currentPeers.map((peer) =>
      peer.id === newUser.id
        ? { ...newUser, call: peer.call, stream: peer.stream }
        : peer
    );

    dispatch(setPeers(newPeers));
  };
};

export const setStreamForPeer = (
  call: MediaConnection,
  stream: MediaStream
): ThunkAction<void, State, unknown, Action> => {
  return (dispatch: Dispatch, getState: () => State) => {
    const currentPeers = getState().rtc.peers;

    if (!currentPeers) {
      logger.error('No peers were set when setting stream!');

      return;
    }

    logger.log(`setting stream for peer id '${call.peer}'`);

    const newPeers = currentPeers.map((peer) =>
      peer.peerId === call.peer ? { ...peer, call, stream } : peer
    );

    dispatch(setPeers(newPeers));
  };
};

export const callPeer = (peerId: string, displayName?: string) => {
  return (
    dispatch: ThunkDispatch<State, unknown, Action>,
    getState: () => State
  ) => {
    const ownPeerClient = getState().rtc.self?.peer;

    if (!ownPeerClient) {
      logger.error('no peer client set when trying to call!');

      return;
    }

    if (ownPeerClient.id === peerId) {
      // not connecting to self

      return;
    }

    const ownStream = getState().rtc.self?.stream;

    if (!ownStream) {
      logger.error('no own stream set when trying to call!');

      return;
    }

    dispatch(nullifyConnection(peerId));

    logger.log(`calling peer '${displayName ? displayName : peerId}'`);

    const call = ownPeerClient.call(peerId, ownStream);

    if (call) {
      callHelpers.attachCallListeners(
        call,
        (mediaCall: MediaConnection, stream: MediaStream) =>
          dispatch(setStreamForPeer(mediaCall, stream))
      );
    } else {
      logger.error(
        `could not call peer ${
          displayName ? displayName : ''
        } with peer id '${peerId}'`
      );
    }
  };
};

export const callPeers = () => {
  return (
    dispatch: ThunkDispatch<State, unknown, Action>,
    getState: () => State
  ) => {
    const currentPeers = getState().rtc.peers;

    if (!currentPeers) {
      logger.error('No peers were set when trying to call!');

      return;
    }

    const ownPeerClient = getState().rtc.self?.peer;

    if (!ownPeerClient) {
      logger.error('no peer client set when trying to call!');

      return;
    }

    const ownStream = getState().rtc.self?.stream;

    if (!ownStream) {
      logger.error('no own stream set when trying to call!');

      return;
    }

    currentPeers.forEach((peerObj) => {
      if (peerObj.peerId) {
        dispatch(callPeer(peerObj.peerId, peerObj.displayName));
      }
    });

    ownPeerClient.on('call', (call) => {
      if (!call) {
        logger.error('unexpected error: no call set in on-call callback');
      }

      logger.log(`incoming call from ${call.peer}`);

      const peer = currentPeers.find((peer) => peer.peerId === call.peer);

      if (peer?.call && peer.call.peer === call.peer) {
        console.warn('call with peer already exists, check for duplicates!');
      }

      call.answer(ownStream);

      const callback = (mediaCall: MediaConnection, stream: MediaStream) => {
        dispatch(setStreamForPeer(mediaCall, stream));
      };

      callHelpers.attachCallListeners(call, callback, true);
    });
  };
};

export default reducer;
