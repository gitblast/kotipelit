import React from 'react';
import socketIOClient from 'socket.io-client';
import Peer from 'peerjs';
import { CommonEvent, RTCGameRoom, RTCPlayer } from '../types';
import { log } from '../utils/logger';
import gameService from '../services/games';
import { useParams } from 'react-router-dom';

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
      const peer = new Peer({
        host: '/',
        port: 3333,
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

  React.useEffect(() => {
    const fetchToken = async () => {
      const gameToken = await gameService.getHostTokenForGame(gameId);

      setToken(gameToken);
    };

    fetchToken();
  }, [gameId]);

  return token;
};

const useMediaStream = (
  showVideo: boolean
): [MediaStream | null, string | null] => {
  const [stream, setStream] = React.useState<MediaStream | null>(null);
  const [error, setError] = React.useState<null | string>(null);

  React.useEffect(() => {
    const getUserMedia = async () => {
      log(`getting user media`);
      try {
        const localStream = await navigator.mediaDevices.getUserMedia({
          audio: {},
        });

        setStream(localStream);
      } catch (e) {
        log(`error getting user media: ${e.message}`);
        setError(e.message);
      }
    };

    if (!stream && showVideo) {
      getUserMedia();
    }

    if (stream && !showVideo) {
      log(`shutting off local stream`);
      setStream(null);
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
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
  showVideo: boolean
): [RTCGameRoom | null, RTCPlayer[] | null] => {
  const [gameRoom, setGameRoom] = React.useState<RTCGameRoom | null>(null);
  const [peersCalled, setPeersCalled] = React.useState<boolean>(false);
  const [peers, setPeers] = React.useState<RTCPlayer[] | null>(null);
  const [peer, peerError] = usePeer();
  const socket = useSocket(token);
  const [mediaStream, mediaStreamError] = useMediaStream(showVideo);

  if (mediaStreamError || peerError) {
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
            peerObj.id === newUser.id ? newUser : peerObj
          );
        });
      });
    }
  }, [socket, peer]);

  React.useEffect(() => {
    if (peers && !showVideo) {
      if (
        !peers.map((peerObj) => peerObj.call).every((call) => call === null)
      ) {
        setPeers((currentPeers) => {
          if (!currentPeers) {
            return currentPeers;
          }

          return currentPeers.map((peerObj) => {
            if (peerObj.call) {
              log(`closing call with ${peerObj.displayName}`);

              peerObj.call.close();
            }

            return { ...peerObj, stream: null, call: null };
          });
        });
      }
    }
  }, [showVideo, peers]);

  React.useEffect(() => {
    if (peer && mediaStream) {
      log(`attaching call listener`);

      peer.on('call', (call) => {
        log(`incoming call from ${call.peer}`);

        call.answer(mediaStream);

        call.on('stream', (stream) => {
          console.log('recieving stream', stream);

          setPeers((currentPeers) => {
            if (!currentPeers) {
              return currentPeers;
            }

            const user = currentPeers.find(
              (peerObj) => peerObj.peerId === call.peer
            );

            if (!user) {
              log(`No user found for call`);

              return currentPeers;
            }

            return currentPeers.map((peerObj) =>
              peerObj.peerId === call.peer
                ? { ...peerObj, stream, call }
                : peerObj
            );
          });
        });

        call.on('close', () => {
          console.log('call closed with', call.peer);
        });

        call.on('error', (error) => {
          console.error('error calling:', error.message);
        });
      });
    }
  }, [peer, mediaStream]);

  React.useEffect(() => {
    if (peer && showVideo && peers && mediaStream && !peersCalled) {
      log(`calling peers`);

      const callPeer = (peerId: string) => {
        const call = peer.call(peerId, mediaStream);

        call.on('stream', (stream) => {
          console.log('recieving stream', stream);

          setPeers((currentPeers) => {
            if (!currentPeers) {
              return currentPeers;
            }

            const user = currentPeers.find(
              (peerObj) => peerObj.peerId === call.peer
            );

            if (!user) {
              log(`No user found for call`);

              return currentPeers;
            }

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
          console.log('call closed with peer', call.peer);
        });

        return call;
      };

      // call players
      peers.forEach((player) => {
        if (peer.id !== player.peerId && player.peerId) {
          log(
            `calling user '${player.displayName}' with peer id ${player.peerId}`
          );

          callPeer(player.peerId);
        }
      });

      setPeersCalled(true);
    }
  }, [peer, mediaStream, showVideo, peers, peersCalled]);

  return [gameRoom, peers];
};

export default useGameRoom;
