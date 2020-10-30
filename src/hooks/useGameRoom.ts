import React from 'react';
import { MediaConnection } from 'peerjs';

import { useDispatch } from 'react-redux';
import { setSelf } from '../reducers/rtcSelf.reducer';
import { setGame } from '../reducers/rtcGame.reducer';

import useAuthSocket from './useAuthSocket';
import usePeer from './usePeer';

import kotitonniLocalData from '../reducers/kotitonni.local.reducer';
import store, { injectLocalDataReducer } from '../store';

import { GameType, RTCGame, RTCGameRoom, RTCPeer, RTCSelf } from '../types';
import logger from '../utils/logger';
import { setTimer } from '../reducers/kotitonni.local.reducer';

const useGameRoom = (
  token: string | null,
  mediaStream: MediaStream | null
): [RTCPeer[] | null] => {
  const [peers, setPeers] = React.useState<RTCPeer[] | null>(null);
  const [peer, peerError] = usePeer();
  const [onCall, setOnCall] = React.useState<boolean>(false);
  const dispatch = useDispatch();
  const [socket, socketError] = useAuthSocket(token);

  if (peerError || socketError) {
    console.error('handle errors!');
  }

  // for testing
  React.useEffect(() => {
    logger.log('peer changed');
  }, [peer]);

  React.useEffect(() => {
    return () => {
      if (peer?.destroyed && peers) {
        logger.log('closing all calls');

        peers.forEach((peerObj) => {
          if (peerObj.call) {
            console.log('closing call with peer', peerObj.displayName);

            peerObj.call.close();
          }
        });
      }
    };
  }, [peer, peers]);

  React.useEffect(() => {
    if (socket && peer) {
      logger.log(`emitting join-gameroom with peer id ${peer.id}`);

      socket.emit('join-gameroom', peer.id);

      socket.on('room-joined', (rtcRoom: RTCGameRoom) => {
        logger.log(`recieved a game room`, rtcRoom);

        if (rtcRoom.game.type === GameType.KOTITONNI) {
          logger.log('injecting local data reducer');
          injectLocalDataReducer(store, kotitonniLocalData);
        }

        const initialPeers = rtcRoom.players
          .concat(rtcRoom.host)
          .map((user) => {
            if (user.peerId === peer.id) {
              // set self

              const self: RTCSelf = {
                id: user.id,
                isHost: user.isHost,
                socket,
              };

              dispatch(setSelf(self));
            }

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

        dispatch(setGame({ ...rtcRoom.game, players: mappedPlayers }));

        setPeers(initialPeers);
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
        logger.log(`recieved timer change to value ${value}`);

        dispatch(setTimer(value));
      });

      socket.on('user-left', (id: string) => {
        logger.log(`recieved user left from ${id}`);

        setPeers((currentPeers) => {
          if (!currentPeers) {
            return currentPeers;
          }

          return currentPeers.map((peerObj) => {
            if (peerObj.id !== id) {
              return peerObj;
            }

            logger.log('test: not setting call / stream to null on user left');

            /**
             
              if (peerObj.call) {
              peerObj.call.close();
            } 
            
            */

            return {
              ...peerObj,
              socketId: null,
              //peerId: null,
              //call: null,
              //stream: null,
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

        logger.log('test: not setting new user call & stream to null');

        setPeers((currentPeers) => {
          if (!currentPeers) {
            return currentPeers;
          }

          return currentPeers.map((peerObj) =>
            peerObj.id === newUser.id
              ? { ...newUser, call: peerObj.call, stream: peerObj.stream }
              : peerObj
          );
        });
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
          setPeers((currentPeers) => {
            if (!currentPeers) {
              return currentPeers;
            }

            const user = currentPeers.find(
              (peerObj) => peerObj.peerId === call.peer
            );

            if (!user) {
              logger.error(`no user found matching call peer id`);

              return currentPeers;
            }

            /** only set stream if not already set. otherwise the stream might get set twice (from calling and answering) */

            if (user.stream) {
              logger.log('user stream already set');

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

  return [peers];
};

export default useGameRoom;
