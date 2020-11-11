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

    const newPeers = currentPeers.map((peer) =>
      peer.peerId === call.peer ? { ...peer, call, stream } : peer
    );

    dispatch(setPeers(newPeers));
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

    ownPeerClient.on('call', (call) => {
      logger.log(`incoming call from ${call.peer}`);

      const peer = currentPeers.find((peer) => peer.peerId === call.peer);

      if (peer?.call && peer.call.peer === call.peer) {
        console.warn('call with peer already exists, check for duplicates!');
      }

      call.answer(ownStream);

      callHelpers.attachCallListeners(
        call,
        (mediaCall: MediaConnection, stream: MediaStream) =>
          dispatch(setStreamForPeer(mediaCall, stream))
      );
    });

    currentPeers.forEach((peerObj) => {
      if (peerObj.peerId) {
        // not calling self
        if (ownPeerClient.id === peerObj.peerId) {
          return;
        }

        if (peerObj.call && peerObj.call.peer === peerObj.peerId) {
          console.warn('call with peer already exists, check for duplicates!');
        }

        logger.log(`calling peer ${peerObj.displayName}`);

        const call = ownPeerClient.call(peerObj.peerId, ownStream);

        callHelpers.attachCallListeners(
          call,
          (mediaCall: MediaConnection, stream: MediaStream) =>
            dispatch(setStreamForPeer(mediaCall, stream))
        );
      }
    });
  };
};

export default reducer;
