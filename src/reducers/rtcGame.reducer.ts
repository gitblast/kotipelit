/* import { Reducer, Dispatch } from 'redux';

import kotitonniLocalDataReducer from './kotitonni.local.reducer';
import { injectLocalDataReducer } from '../store';

import { GameType, RTCGame, RTCGameAction, RTCSelf } from '../types';
import logger from '../utils/logger';
import Peer from 'peerjs';

const initialData = null;

const reducer: Reducer<RTCGame | null, RTCGameAction> = (
  state: RTCGame | null = initialData,
  action: RTCGameAction
) => {
  switch (action.type) {
    case 'INIT_GAME':
      return action.payload.initialGame;
    case 'SET_GAME':
      return action.payload;
    default:
      return state;
  }
};

export const initGame = (peers: RTCPeer[], self: RTCSelf, game: RTCGame) => {
  return {
    type: 'INIT_GAME',
    payload: {
      initialPeers: peers,
      initialSelf: self,
      initialGame: game,
    },
  };
};

export const setGame = (data: RTCGame): RTCGameAction => {
  return {
    type: 'SET_GAME',
    payload: data,
  };
};

export const initRTCGame = (
  rtcRoom: RTCGameRoom,
  socket: SocketIOClient.Socket,
  peer: Peer
) => {
  return (dispatch: Dispatch) => {
    if (rtcRoom.game.type === GameType.KOTITONNI) {
      logger.log('injecting local data reducer');
      injectLocalDataReducer(kotitonniLocalDataReducer);
    }

    const allPeers = rtcRoom.players.concat(rtcRoom.host);

    const selfObj = allPeers.find((peerObj) => peerObj.peerId === peer.id);

    if (!selfObj) {
      logger.error('peer self not found!');

      return;
    }

    const initialSelf = { ...selfObj, socket, peer, stream: null };

    const initialPeers = allPeers.map((user) => {
      return {
        ...user,
        stream: null,
        call: null,
        isMe: user.peerId === peer.id,
      };
    });

    const mappedPlayers = rtcRoom.game.players.map((player) => ({
      ...player,
      hasTurn: player.id === rtcRoom.game.info.turn,
    }));

    const initialGame = { ...rtcRoom.game, players: mappedPlayers };

    dispatch(initGame(initialPeers, initialSelf, initialGame));
  };
};

export default reducer;

 */
export default {};
