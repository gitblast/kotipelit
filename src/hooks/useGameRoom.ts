import React from 'react';

import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { initRTCGame, setGame } from '../reducers/rtcGame.reducer';

import useAuthSocket from './useAuthSocket';
import usePeer from './usePeer';
import useMediaStream from './useMediaStream';

import { RTCGame, RTCGameRoom, RTCPeer, State } from '../types';
import logger from '../utils/logger';
import { setTimer } from '../reducers/kotitonni.local.reducer';
import { callPeers, userJoined, userLeft } from '../reducers/rtcPeers.reducer';
import { setStream } from '../reducers/rtcSelf.reducer';

const useGameRoom = (
  token: string | null,
  onCall: boolean,
  mediaConstraints: MediaStreamConstraints
): RTCPeer[] | null => {
  const [peersCalled, setPeersCalled] = React.useState(false);
  const peers = useSelector((state: State) => state.rtc.peers, shallowEqual);
  const streamSet = useSelector((state: State) => !!state.rtc.self?.stream);
  const [peer, peerError] = usePeer(token, null, true);
  const dispatch = useDispatch();
  const socketLeaveCallback = React.useCallback(
    (socket: SocketIOClient.Socket) => socket.emit('leave-room'),
    []
  );
  const [socket, socketError] = useAuthSocket(token, socketLeaveCallback);
  const [mediaStream, mediaStreamError] = useMediaStream(
    onCall,
    mediaConstraints
  );

  if (peerError || socketError || mediaStreamError) {
    console.error('handle errors!', peerError, socketError, mediaStreamError);
  }

  React.useEffect(() => {
    if (!streamSet && mediaStream) {
      dispatch(setStream(mediaStream));
    }
  }, [mediaStream, streamSet, dispatch]);

  React.useEffect(() => {
    if (socket && peer) {
      logger.log(`emitting join-gameroom with peer id ${peer.id}`);

      socket.emit('join-gameroom', peer.id);

      socket.on('room-joined', (rtcRoom: RTCGameRoom) => {
        logger.log(`recieved a game room`, rtcRoom);

        dispatch(initRTCGame(rtcRoom, socket, peer));
      });

      socket.on('rtc_error', (msg: string) => {
        logger.error('rtc error:', msg);
      });

      socket.on('game updated', (updatedGame: RTCGame) => {
        logger.log(`recieved 'game updated' with data;`, updatedGame);

        const mappedPlayers = updatedGame.players.map((player) => ({
          ...player,
          hasTurn: player.id === updatedGame.info.turn,
        }));

        dispatch(setGame({ ...updatedGame, players: mappedPlayers }));
      });

      socket.on('timer-changed', (value: number) => {
        dispatch(setTimer(value));
      });

      socket.on('user-socket-disconnected', (id: string) => {
        logger.log(`recieved socket disconnected from ${id}`);
      });

      socket.on('user-left', (id: string) => {
        logger.log(`recieved user left from ${id}`);

        dispatch(userLeft(id));
      });

      socket.on('user-joined', (newUser: RTCPeer) => {
        logger.log(`recieved new user:`, newUser);

        logger.log(
          `setting new ${newUser.isHost ? `host` : `player`}: ${
            newUser.displayName
          }`
        );

        dispatch(userJoined(newUser));
      });
    }
  }, [socket, peer, dispatch]);

  React.useEffect(() => {
    if (mediaStream && onCall && !peersCalled) {
      logger.log('calling all peers');

      setPeersCalled(true);

      dispatch(callPeers());
    }
  }, [mediaStream, onCall, peersCalled, dispatch]);

  const peersWithOwnStreamSet = React.useMemo(() => {
    if (!peers) {
      return null;
    }

    return peers.map((peerObj) =>
      peerObj.isMe ? { ...peerObj, stream: mediaStream } : peerObj
    );
  }, [mediaStream, peers]);

  return peersWithOwnStreamSet;
};

export default useGameRoom;
