import React from 'react';

import { useParams } from 'react-router-dom';

import gameService from '../services/games';

import { log } from '../utils/logger';

// const log = (msg: unknown) => console.log(msg);

interface ParamTypes {
  username: string;
  playerId: string;
}

export const usePlayerGameToken = (): [string | null, string | null] => {
  const [token, setToken] = React.useState<null | string>(null);
  const [error, setError] = React.useState<null | string>(null);

  const { username, playerId } = useParams<ParamTypes>();

  React.useEffect(() => {
    const fetchToken = async () => {
      try {
        log(`fetching player token`);

        const gameToken = await gameService.getPlayerTokenForGame(
          username,
          playerId,
          true
        );

        setToken(gameToken);
      } catch (e) {
        console.error('error with player token', e.message);
        setError(e.message);
      }
    };

    if (username && playerId && !token) {
      fetchToken();
    }
  }, [token, username, playerId]);

  return [token, error];
};

export default usePlayerGameToken;
