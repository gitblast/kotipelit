import React from 'react';
import { io as socketIOClient, Socket } from 'socket.io-client';
import { RTCGame } from '../../types';

const useDashboardSocket = (
  authToken: string,
  setGames: React.Dispatch<React.SetStateAction<RTCGame[]>>
) => {
  const [socket, setSocket] = React.useState<null | Socket>();

  React.useEffect(() => {
    if (!socket) {
      const path =
        // eslint-disable-next-line no-undef
        process?.env.NODE_ENV === 'development'
          ? 'http://localhost:3333/dash'
          : '/dash';

      const client = socketIOClient(path, {
        autoConnect: false,
        transports: ['websocket'],
        upgrade: false,
        auth: {
          token: `Bearer ${authToken}`,
        },
      });

      client.on('game-has-updated', (updatedGame: RTCGame) => {
        setGames((currentGames: RTCGame[]) => {
          let updated = false;

          const updatedGames = currentGames.map((game) => {
            if (game.id === updatedGame.id) {
              updated = true;

              return updatedGame;
            }

            return game;
          });

          if (updated) {
            return updatedGames;
          }

          return currentGames.concat(updatedGame);
        });
      });

      client.connect();

      setSocket(client);
    }
  }, [authToken, socket, setGames]);
};

export default useDashboardSocket;
