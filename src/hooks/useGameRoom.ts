import React from 'react';
import socketIOClient from 'socket.io-client';
import Peer, { MediaConnection } from 'peerjs';
import { CommonEvent, RTCGame, RTCGameRoom, RTCPlayer } from '../types';
// import { log } from '../utils/logger';
import gameService from '../services/games';
import { useParams } from 'react-router-dom';

const log = (msg: unknown) => console.log(msg);

const useSocket = (token: string | null) => {
  const [
    socketClient,
    setSocketClient,
  ] = React.useState<SocketIOClient.Socket | null>(null);

  React.useEffect(() => {
    const initSocket = async () => {
      log('initializing socket');
      const socket = socketIOClient();

      socket.on(CommonEvent.CONNECT, () => {
        socket
          .emit(CommonEvent.AUTH_REQUEST, { token })
          .on(CommonEvent.AUTHENTICATED, () => {
            log('socketio authorized');

            setSocketClient(socket);
          })
          .on(CommonEvent.UNAUTHORIZED, (error: { message: string }) => {
            log('socketio unauthorized');

            throw new Error(error.message);
          });
      });
    };

    if (token && !socketClient) {
      initSocket();
    }

    return () => {
      if (socketClient && socketClient.connected) {
        log(`disconnecting socket`);

        socketClient.disconnect();
      }
    };
  }, [token, socketClient]);

  return socketClient;
};

const usePeer = (): [Peer | null, string | null] => {
  const [peerClient, setPeerClient] = React.useState<Peer | null>(null);
  const [error, setError] = React.useState<null | string>(null);

  React.useEffect(() => {
    if (!peerClient) {
      const port =
        // eslint-disable-next-line no-undef
        process && process.env.NODE_ENV === 'development' ? 3333 : 443;

      log(`using port ${port}`);

      const peer = new Peer({
        host: '/',
        port: port,
        debug: 1,
        path: '/api/peerjs',
      });

      peer.on('error', (error) => {
        console.error('peer error', error.message);

        setError(error.message);
      });

      peer.on('open', () => {
        log(`opened peer connection with id ${peer.id}`);

        setPeerClient(peer);
      });
    }

    return () => {
      if (peerClient) {
        log(`disconnecting peer`);
        peerClient.destroy();
      }
    };
  }, [peerClient]);

  return [peerClient, error];
};

interface ParamTypes {
  username: string;
  playerId: string;
}

export const usePlayerGameToken = () => {
  const [token, setToken] = React.useState<null | string>(null);

  const { username, playerId } = useParams<ParamTypes>();

  React.useEffect(() => {
    const fetchToken = async () => {
      log(`fetching player token`);

      const gameToken = await gameService.getPlayerTokenForGame(
        username,
        playerId,
        true
      );

      setToken(gameToken);
    };

    if (username && playerId && !token) {
      fetchToken();
    }
  }, [token, username, playerId]);

  return token;
};

export const useHostGameToken = (gameId: string) => {
  const [token, setToken] = React.useState<null | string>(null);
  const [error, setError] = React.useState<null | string>(null);

  React.useEffect(() => {
    const fetchToken = async () => {
      try {
        const gameToken = await gameService.getHostTokenForGame(gameId);

        setToken(gameToken);
      } catch (e) {
        console.error(`Error with host token: ${e.message}`);
        setError(e.message);
      }
    };

    fetchToken();
  }, [gameId]);

  return [token, error];
};

export const useMediaStream = (
  showVideo: boolean
): [MediaStream | null, string | null] => {
  const [stream, setStream] = React.useState<MediaStream | null>(null);
  const [error, setError] = React.useState<null | string>(null);

  React.useEffect(() => {
    const getUserMedia = async () => {
      log(`getting user media`);
      try {
        const localStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });

        setStream(localStream);
      } catch (e) {
        log(`error getting user media: ${e.message}`);
        setError(e.message);
      }
    };

    if (!stream && showVideo) {
      getUserMedia();
    } else {
      return () => {
        if (stream) {
          log(`shutting off local stream`);
          stream.getTracks().forEach((track) => track.stop());
        }
      };
    }
  }, [stream, showVideo]);

  return [stream, error];
};

interface RTCCall {
  call: Peer.MediaConnection | null;
  id: string | null;
  stream: MediaStream | null;
  displayName: string;
  isHost: boolean;
}

const useGameRoom = (
  token: string | null,
  mediaStream: MediaStream | null
): [RTCGame | null, RTCPlayer[] | null, string | null] => {
  const [gameRoom, setGameRoom] = React.useState<RTCGameRoom | null>(null);
  const [peers, setPeers] = React.useState<RTCPlayer[] | null>(null);
  const [peer, peerError] = usePeer();
  const [onCall, setOnCall] = React.useState<boolean>(false);

  const socket = useSocket(token);

  if (peerError) {
    console.error('handle errors!');
  }

  // for testing
  React.useEffect(() => {
    console.log('peer changed', peer);
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
              stream: null,
              call: null,
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
          console.error('error calling:', error.message);
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
