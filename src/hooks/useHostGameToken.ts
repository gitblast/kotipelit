import React from 'react';
import { useParams } from 'react-router-dom';

import gameService from '../services/games';

export const useHostGameToken = () => {
  const [token, setToken] = React.useState<null | string>(null);
  const [error, setError] = React.useState<null | string>(null);

  const { gameID } = useParams<{ gameID: string }>();

  React.useEffect(() => {
    const fetchToken = async () => {
      try {
        const gameToken = await gameService.getHostTokenForGame(gameID);

        setToken(gameToken);
      } catch (e) {
        console.error(`Error with host token: ${e.message}`);
        setError(e.message);
      }
    };

    if (gameID && !token) {
      fetchToken();
    }
  }, [gameID]);

  return [token, error];
};

export default useHostGameToken;
