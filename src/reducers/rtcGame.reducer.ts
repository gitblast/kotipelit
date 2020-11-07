import { Reducer, Dispatch } from 'redux';

import kotitonniLocalData from './kotitonni.local.reducer';
import store, { injectLocalDataReducer } from '../store';

import {
  GameType,
  RTCGame,
  RTCGameAction,
  RTCGameRoom,
  RTCPeer,
  RTCSelf,
} from '../types';
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
      injectLocalDataReducer(store, kotitonniLocalData);
    }

    console.log('perseen reikä');

    const allPeers = rtcRoom.players.concat(rtcRoom.host);

    const selfObj = allPeers.find((peerObj) => peerObj.peerId === peer.id);

    if (!selfObj) {
      logger.error('peer self not found!');

      return;
    }

    const initialSelf = { ...selfObj, socket, peer, stream: null };

    const initialPeers = rtcRoom.players.concat(rtcRoom.host).map((user) => {
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
