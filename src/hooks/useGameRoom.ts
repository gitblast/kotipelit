import React from 'react';
import { MediaConnection } from 'peerjs';

import useSocket from './useSocket';
import usePeer from './usePeer';

import { RTCGame, RTCGameRoom, RTCPlayer } from '../types';
// import { log } from '../utils/logger';

const log = (msg: unknown) => console.log(msg);

const useGameRoom = (
  token: string | null,
  mediaStream: MediaStream | null
): [RTCGame | null, RTCPlayer[] | null, string | null] => {
  const [gameRoom, setGameRoom] = React.useState<RTCGameRoom | null>(null);
  const [peers, setPeers] = React.useState<RTCPlayer[] | null>(null);
  const [peer, peerError] = usePeer();
  const [onCall, setOnCall] = React.useState<boolean>(false);

  const [socket, socketError] = useSocket(token);

  if (peerError || socketError) {
    console.error('handle errors!');
  }

  // for testing
  React.useEffect(() => {
    log('peer changed');
  }, [peer]);

  React.useEffect(() => {
    if (socket && peer) {
      log(`emitting join-gameroom with peer id ${peer.id}`);

      socket.emit('join-gameroom', peer.id);

      socket.on('room-joined', (rtcRoom: RTCGameRoom) => {
        log(`recieved a game room`);

        log(rtcRoom);

        const initialPeers = rtcRoom.players
          .concat(rtcRoom.host)
          .map((user) => ({ ...user, stream: null, call: null }));

        setGameRoom(rtcRoom);
        setPeers(initialPeers);
      });

      socket.on('user-left', (id: string) => {
        log(`recieved user left from ${id}`);

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

      socket.on('user-joined', (newUser: RTCPlayer) => {
        log(`recieved new user`);
        log(newUser);

        log(
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
              log('User stream already set');

              return currentPeers;
            }

            log(`recieving stream from ${call.peer}`);

            return currentPeers.map((peerObj) =>
              peerObj.peerId === call.peer
                ? { ...peerObj, stream, call }
                : peerObj
            );
          });
        });

        call.on('error', (error) => {
          console.error('call error:', error.message);
        });

        call.on('close', () => {
          log(`call closed with peer ${call.peer}`);
        });
      };

      log(`attaching call listener`);

      peer.on('call', (call) => {
        log(`incoming call from ${call.peer}`);

        call.answer(mediaStream);

        attachListeners(call);
      });

      peers.forEach((peerObj) => {
        if (peerObj.peerId) {
          // not calling self
          if (peer.id === peerObj.peerId) {
            return;
          }

          log(`calling peer ${peerObj.displayName}`);

          const call = peer.call(peerObj.peerId, mediaStream);

          attachListeners(call);
        }
      });
    },
    [peers, peer]
  );

  React.useEffect(() => {
    if (mediaStream && !onCall) {
      log('calling all peers');

      setOnCall(true);

      joinCall(mediaStream);
    }
  }, [joinCall, mediaStream, onCall]);

  const myPeerId = peer ? peer.id : null;

  return [gameRoom ? gameRoom.game : null, peers, myPeerId];
};

export default useGameRoom;
