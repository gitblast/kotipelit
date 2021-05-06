import React from 'react';
import { io as socketIOClient, Socket } from 'socket.io-client';

import { CommonEvent } from '../types';

import logger from '../utils/logger';
import { useGameErrorState } from '../context';

const useAuthSocket = (
  token: string | null,
  onLeave?: (socket: Socket) => void
) => {
  const [socketClient, setSocketClient] = React.useState<Socket | null>(null);

  const { setError } = useGameErrorState();

  React.useEffect(() => {
    const initSocket = (authToken: string) => {
      logger.log('initializing socket');

      const path =
        // eslint-disable-next-line no-undef
        process?.env.NODE_ENV === 'development' ? 'http://localhost:3333' : '/';

      const socket = socketIOClient(path, {
        autoConnect: false,
        transports: ['websocket'],
        upgrade: false,
        auth: {
          token: `Bearer ${authToken}`,
        },
      });

      socket.on('connect_error', (error: Error) => {
        logger.error('socket.io connect error:', error.message);

        setError(error, 'Ongelma yhdistäessä pelipalvelimeen.');
      });

      socket.on('error', (error: Error) => {
        logger.error('socket.io error:', error.message);

        setError(error, 'Ongelma yhteydessä pelipalvelimeen.');
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
        logger.log('socketio connected');
      });

      setSocketClient(socket);
    };

    if (token && !socketClient) {
      initSocket(token);
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
  }, [token, socketClient, onLeave, setError]);

  return socketClient;
};

export default useAuthSocket;
