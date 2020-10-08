import React from 'react';

import gameService from '../services/games';
import { Role, GameTokenConfig } from '../types';

// import { log } from '../utils/logger';

const log = (msg: unknown) => console.log(msg);

/** currently not in use  */
export const useGameToken = (
  config: GameTokenConfig
): [string | null, string | null] => {
  const [token, setToken] = React.useState<null | string>(null);
  const [error, setError] = React.useState<null | string>(null);

  React.useEffect(() => {
    const fetchPlayerToken = async (username: string, playerId: string) => {
      try {
        log(`fetching player token`);

        const gameToken = await gameService.getPlayerTokenForGame(
          username,
          playerId,
          true
        );

        setToken(gameToken);
      } catch (e) {
        console.error(`Error with player token: ${e.message}`);
        setError(e.message);
      }
    };

    const fetchHostToken = async (gameId: string) => {
      try {
        log(`fetching host token`);
        const gameToken = await gameService.getHostTokenForGame(gameId);

        setToken(gameToken);
      } catch (e) {
        console.error(`Error with host token: ${e.message}`);
        setError(e.message);
      }
    };

    if (!token) {
      config.type === Role.HOST
        ? fetchHostToken(config.gameId)
        : fetchPlayerToken(config.username, config.playerId);
    }
  }, [token, config]);

  return [token, error];
};

export default useGameToken;
