import React from 'react';
import socketIOClient from 'socket.io-client';

import { CommonEvent } from '../types';

import { log } from '../utils/logger';

// const log = (msg: unknown) => console.log(msg);

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
      log('initializing socket');

      const socket = socketIOClient();

      socket.on(CommonEvent.CONNECT, () => {
        socket.emit(CommonEvent.AUTH_REQUEST, { token });

        socket.on(CommonEvent.AUTHENTICATED, () => {
          log('socketio authorized');

          setSocketClient(socket);
        });

        socket.on(CommonEvent.UNAUTHORIZED, (error: { message: string }) => {
          console.error('socket error:', error.message);
          setError(error.message);
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

  return [socketClient, error];
};

export default useSocket;
