import React from 'react';
import { useParams } from 'react-router-dom';

import gameService from '../services/games';

import logger from '../utils/logger';

export const useSpectatorGameToken = () => {
  const [token, setToken] = React.useState<null | string>(null);
  const [error, setError] = React.useState<null | string>(null);

  const { gameID } = useParams<{ gameID: string }>();

  React.useEffect(() => {
    const fetchToken = async () => {
      try {
        const gameToken = await gameService.getSpectatorTokenForGame(gameID);

        setToken(gameToken);
      } catch (e) {
        logger.error(`Error with spectator token: ${e.message}`);
        setError(e.message);
      }
    };

    if (gameID && !token) {
      fetchToken();
    }
  }, [gameID, token]);

  return [token, error];
};

export default useSpectatorGameToken;
