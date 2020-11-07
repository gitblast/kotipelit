import { Dispatch, Reducer } from 'redux';

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

export default reducer;
