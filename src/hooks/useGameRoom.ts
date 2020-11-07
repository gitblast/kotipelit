import React from 'react';
import { MediaConnection } from 'peerjs';

import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { initRTCGame, setGame } from '../reducers/rtcGame.reducer';

import useAuthSocket from './useAuthSocket';
import usePeer from './usePeer';
import useMediaStream from './useMediaStream';

import { RTCGame, RTCGameRoom, RTCPeer, State } from '../types';
import logger from '../utils/logger';
import { setTimer } from '../reducers/kotitonni.local.reducer';
import {
  setStreamForPeer,
  userJoined,
  userLeft,
} from '../reducers/rtcPeers.reducer';
import { setStream } from '../reducers/rtcSelf.reducer';

const useGameRoom = (
  token: string | null,
  onCall: boolean,
  mediaConstraints: MediaStreamConstraints
): RTCPeer[] | null => {
  const [peersCalled, setPeersCalled] = React.useState(false);
  const peers = useSelector((state: State) => state.rtc.peers, shallowEqual);
  const streamSet = useSelector((state: State) => !!state.rtc.self?.stream);
  const [peer, peerError] = usePeer();
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
    console.error('handle errors!');
  }

  React.useEffect(() => {
    if (!streamSet && mediaStream) {
      dispatch(setStream(mediaStream));
    }
  }, [mediaStream, streamSet, dispatch]);

  React.useEffect(() => {
    return () => {
      if (socket) {
        socket.emit('leave-room');
      }
    };
  }, [socket]);

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

  const joinCall = React.useCallback(
    (mediaStream: MediaStream) => {
      if (!peers) {
        logger.error('no peers set when trying to call!');

        return;
      }

      if (!peer) {
        logger.error('no peer client set when trying to call!');

        return;
      }

      const attachListeners = (call: MediaConnection) => {
        call.on('stream', (stream) => {
          dispatch(setStreamForPeer(call, stream));
        });

        call.on('error', (error) => {
          logger.error('call error:', error.message);
        });

        call.on('close', () => {
          logger.log(`call closed with peer ${call.peer}`);
        });
      };

      logger.log(`attaching call listener`);

      peer.on('call', (call) => {
        logger.log(`incoming call from ${call.peer}`);

        call.answer(mediaStream);

        attachListeners(call);
      });

      peers.forEach((peerObj) => {
        if (peerObj.peerId) {
          // not calling self
          if (peer.id === peerObj.peerId) {
            return;
          }

          logger.log(`calling peer ${peerObj.displayName}`);

          const call = peer.call(peerObj.peerId, mediaStream);

          attachListeners(call);
        }
      });
    },
    [peers, peer, dispatch]
  );

  React.useEffect(() => {
    if (mediaStream && onCall && !peersCalled) {
      logger.log('calling all peers');

      setPeersCalled(true);

      joinCall(mediaStream);
    }
  }, [joinCall, mediaStream, onCall, peersCalled]);

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
