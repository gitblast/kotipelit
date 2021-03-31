import React from 'react';
import { useParams } from 'react-router-dom';

import gameService from '../services/games';

import logger from '../utils/logger';
import { useGameErrorState } from '../context';

export const useSpectatorGameToken = () => {
  const [token, setToken] = React.useState<null | string>(null);
  const { setError } = useGameErrorState();

  const { gameID } = useParams<{ gameID: string }>();

  React.useEffect(() => {
    const fetchToken = async () => {
      try {
        const gameToken = await gameService.getSpectatorTokenForGame(gameID);

        setToken(gameToken);
      } catch (e) {
        logger.error(`Error with spectator token: ${e.message}`);

        const errorMsg =
          'Peliin liittyminen epäonnistui. Tarkista pelilinkkisi.';

        setError(e, errorMsg);
      }
    };

    if (gameID && !token) {
      fetchToken();
    }
  }, [gameID, token, setError]);

  return token;
};

export default useSpectatorGameToken;
