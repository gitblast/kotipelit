import React from 'react';

import { useParams } from 'react-router-dom';

import gameService from '../services/games';

import logger from '../utils/logger';
import { useGameErrorState } from '../context';

interface ParamTypes {
  username: string;
  inviteCode: string;
}

export const usePlayerGameToken = () => {
  const [token, setToken] = React.useState<null | string>(null);
  const { setError } = useGameErrorState();

  const { username, inviteCode } = useParams<ParamTypes>();

  React.useEffect(() => {
    const fetchToken = async () => {
      try {
        logger.log(`fetching player token`);
        const gameToken = await gameService.getPlayerTokenForGame(
          username,
          inviteCode,
          true
        );

        setToken(gameToken);
      } catch (e) {
        logger.error('error with player token', e.message);

        const errorMsg =
          'Peliin liittyminen epäonnistui. Tarkista pelilinkkisi.';

        setError(e, errorMsg);
      }
    };

    if (username && inviteCode && !token) {
      fetchToken();
    }
  }, [token, username, inviteCode, setError]);

  return token;
};

export default usePlayerGameToken;
