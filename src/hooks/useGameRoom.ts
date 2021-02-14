import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import useAuthSocket from './useAuthSocket';
import useMediaStream from './useMediaStream';

import { RTCGame, State } from '../types';
import logger from '../utils/logger';
import { setTimer } from '../reducers/kotitonni.local.reducer';
import { setStream } from '../reducers/rtcSelf.reducer';
import { useHistory, useParams } from 'react-router-dom';

const useGameRoom = (
  token: string | null,
  onCall: boolean,
  mediaConstraints: MediaStreamConstraints
): [] | null => {
  const history = useHistory();
  const hostname = useParams<{ username: string }>().username;
  const [peersCalled, setPeersCalled] = React.useState(false);
  const streamSet = useSelector((state: State) => !!state.rtc.self?.stream);

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

  if (socketError || mediaStreamError) {
    console.error('handle errors!', socketError, mediaStreamError);
  }

  React.useEffect(() => {
    if (!streamSet && mediaStream) {
      dispatch(setStream(mediaStream));
    }
  }, [mediaStream, streamSet, dispatch]);

  React.useEffect(() => {
    if (socket) {
      socket.on('game-ended', () => {
        logger.log(`recieved 'game-ended'`);

        history.push(`/${hostname}/kiitos`);
      });

      socket.on('room-joined', (rtcGame: RTCGame) => {
        logger.log(`recieved a game room`, rtcGame);

        //dispatch(initRTCGame(rtcRoom, socket));
      });

      socket.on('rtc_error', (msg: string) => {
        logger.error('rtc error:', msg);
      });

      socket.on('game updated', (updatedGame: RTCGame) => {
        logger.log(`recieved 'game updated' with data:`, updatedGame);

        const mappedPlayers = updatedGame.players.map((player) => ({
          ...player,
          hasTurn: player.id === updatedGame.info.turn,
        }));

        // dispatch(setGame({ ...updatedGame, players: mappedPlayers }));
      });

      socket.on('timer-changed', (value: number) => {
        dispatch(setTimer(value));
      });

      socket.on('user-socket-disconnected', (id: string) => {
        logger.log(`recieved socket disconnected from ${id}`);
      });

      socket.on('user-left', (id: string) => {
        logger.log(`recieved user left from ${id}`);

        console.log('not dispätching user left');
        //dispatch(userLeft(id));
      });

      socket.on('user-joined', (newUser: unknown) => {
        logger.log(`recieved new user:`, newUser);

        /* logger.log(
          `setting new ${newUser.isHost ? `host` : `player`}: ${
            newUser.displayName
          }`
        ); */

        // dispatch(userJoined(newUser));
      });
    }
  }, [socket, dispatch, hostname, history]);

  React.useEffect(() => {
    if (mediaStream && onCall && !peersCalled) {
      logger.log('calling all peers');

      setPeersCalled(true);

      console.log('not calling all peers');

      // dispatch(callPeers());
    }
  }, [mediaStream, onCall, peersCalled, dispatch]);

  /* const peersWithOwnStreamSet = React.useMemo(() => {
    if (!peers) {
      return null;
    }

    return [];

    /* return peers.map((peerObj) =>
      peerObj.isMe ? { ...peerObj, stream: mediaStream } : peerObj
    ); 
  }, [mediaStream, peers]);
 */
  // return peersWithOwnStreamSet;

  return [];
};

export default useGameRoom;
