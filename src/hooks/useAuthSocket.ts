import React from 'react';
import socketIOClient from 'socket.io-client';

import { CommonEvent } from '../types';

import logger from '../utils/logger';

const useAuthSocket = (
  token: string | null,
  onLeave?: (socket: SocketIOClient.Socket) => void
): [SocketIOClient.Socket | null, string | null] => {
  const [
    socketClient,
    setSocketClient,
  ] = React.useState<SocketIOClient.Socket | null>(null);

  const [error, setError] = React.useState<null | string>(null);

  React.useEffect(() => {
    const initSocket = () => {
      logger.log('initializing socket');

      const socket = socketIOClient('/');

      socket.on('error', (error: Error) => {
        logger.error('socket.io error:', error.message);
      });

      socket.on('disconnect', (reason: string) => {
        logger.log('socket.io disconnected. reason:', reason);
      });

      socket.on('reconnect', () => {
        logger.log('socket.io reconnected');
      });

      socket.on('reconnect_attempt', (attempt: number) => {
        logger.log('socketio trying to reconnect, attempt number:', attempt);
      });

      socket.on(CommonEvent.CONNECT, () => {
        socket.emit(CommonEvent.AUTH_REQUEST, { token });

        socket.on(CommonEvent.AUTHENTICATED, () => {
          logger.log('socketio authorized');

          window.onbeforeunload = () => {
            socket.emit('leave-room');

            return null;
          };

          setSocketClient(socket);
        });

        socket.on(CommonEvent.UNAUTHORIZED, (error: { message: string }) => {
          logger.error('socket error:', error.message);
          setError(error.message);
        });
      });
    };

    if (token && !socketClient) {
      initSocket();
    }

    return () => {
      if (socketClient && socketClient.connected) {
        logger.log(`disconnecting socket`);

        if (onLeave) {
          logger.log(`calling socket leave callback`);

          onLeave(socketClient);
        }

        socketClient.disconnect();
      }
    };
  }, [token, socketClient, onLeave]);

  const returnedTuple: [
    SocketIOClient.Socket | null,
    string | null
  ] = React.useMemo(() => [socketClient, error], [socketClient, error]);

  return returnedTuple;
};

export default useAuthSocket;
