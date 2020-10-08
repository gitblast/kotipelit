import React from 'react';
import socketIOClient from 'socket.io-client';

import { CommonEvent } from '../types';

import logger from '../utils/logger';

const useSocket = (
  token: string | null
): [SocketIOClient.Socket | null, string | null] => {
  const [
    socketClient,
    setSocketClient,
  ] = React.useState<SocketIOClient.Socket | null>(null);

  const [error, setError] = React.useState<null | string>(null);

  React.useEffect(() => {
    const initSocket = () => {
      logger.log('initializing socket');

      const socket = socketIOClient();

      socket.on(CommonEvent.CONNECT, () => {
        socket.emit(CommonEvent.AUTH_REQUEST, { token });

        socket.on(CommonEvent.AUTHENTICATED, () => {
          logger.log('socketio authorized');

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

        socketClient.disconnect();
      }
    };
  }, [token, socketClient]);

  return [socketClient, error];
};

export default useSocket;
