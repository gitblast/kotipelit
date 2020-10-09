import React from 'react';
import { MediaConnection } from 'peerjs';

import useAuthSocket from './useAuthSocket';
import usePeer from './usePeer';

import { RTCGame, RTCGameRoom, RTCPeer } from '../types';
import logger from '../utils/logger';

const useGameRoom = (
  token: string | null,
  mediaStream: MediaStream | null
): [RTCGame | null, RTCPeer[] | null, SocketIOClient.Socket | null] => {
  const [gameRoom, setGameRoom] = React.useState<RTCGameRoom | null>(null);
  const [peers, setPeers] = React.useState<RTCPeer[] | null>(null);
  const [peer, peerError] = usePeer();
  const [onCall, setOnCall] = React.useState<boolean>(false);

  const [socket, socketError] = useAuthSocket(token);

  if (peerError || socketError) {
    console.error('handle errors!');
  }

  // for testing
  React.useEffect(() => {
    logger.log('peer changed');
  }, [peer]);

  React.useEffect(() => {
    if (socket && peer) {
      logger.log(`emitting join-gameroom with peer id ${peer.id}`);

      socket.emit('join-gameroom', peer.id);

      socket.on('room-joined', (rtcRoom: RTCGameRoom) => {
        logger.log(`recieved a game room`);

        logger.log(rtcRoom);

        const initialPeers = rtcRoom.players
          .concat(rtcRoom.host)
          .map((user) => ({
            ...user,
            stream: null,
            call: null,
            isMe: user.peerId === peer.id,
          }));

        setGameRoom(rtcRoom);
        setPeers(initialPeers);
      });

      socket.on('user-left', (id: string) => {
        logger.log(`recieved user left from ${id}`);

        console.warn('experimental: not setting user stream to null');

        setPeers((currentPeers) => {
          if (!currentPeers) {
            return currentPeers;
          }

          return currentPeers.map((peerObj) => {
            if (peerObj.id !== id) {
              return peerObj;
            }

            if (peerObj.call) {
              peerObj.call.close();
            }

            return {
              ...peerObj,
              socketId: null,
              peerId: null,
              call: null,
              // stream: null,
            };
          });
        });
      });

      socket.on('user-joined', (newUser: RTCPeer) => {
        logger.log(`recieved new user`);
        logger.log(newUser);

        logger.log(
          `setting new ${newUser.isHost ? `host` : `player`}: ${
            newUser.displayName
          }`
        );

        setPeers((currentPeers) => {
          if (!currentPeers) {
            return currentPeers;
          }

          return currentPeers.map((peerObj) =>
            peerObj.id === newUser.id
              ? { ...newUser, call: null, stream: null }
              : peerObj
          );
        });
      });
    }
  }, [socket, peer]);

  const joinCall = React.useCallback(
    (mediaStream: MediaStream) => {
      if (!peers) {
        console.error('no peers set when trying to call!');

        return;
      }

      if (!peer) {
        console.error('no peer client set when trying to call!');

        return;
      }

      const attachListeners = (call: MediaConnection) => {
        call.on('stream', (stream) => {
          setPeers((currentPeers) => {
            if (!currentPeers) {
              return currentPeers;
            }

            const user = currentPeers.find(
              (peerObj) => peerObj.peerId === call.peer
            );

            if (!user) {
              console.error(`No user found matching call peer id`);

              return currentPeers;
            }

            /** only set stream if not already set. otherwise the steam might get set twice (from calling and answering) */

            if (user.stream) {
              logger.log('User stream already set');

              return currentPeers;
            }

            logger.log(`recieving stream from ${call.peer}`);

            return currentPeers.map((peerObj) =>
              peerObj.peerId === call.peer
                ? { ...peerObj, stream, call }
                : peerObj
            );
          });
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
    [peers, peer]
  );

  React.useEffect(() => {
    if (mediaStream && !onCall) {
      logger.log('calling all peers');

      setOnCall(true);

      joinCall(mediaStream);
    }
  }, [joinCall, mediaStream, onCall]);

  const game = React.useMemo(() => {
    if (!gameRoom) {
      return null;
    }

    const mappedPlayers = gameRoom.game.players.map((player) => ({
      ...player,
      hasTurn: player.id === gameRoom.game.info.turn,
    }));

    return { ...gameRoom.game, players: mappedPlayers };
  }, [gameRoom]);

  return [game, peers, socket];
};

export default useGameRoom;
