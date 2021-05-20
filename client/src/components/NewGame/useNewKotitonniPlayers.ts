import React from 'react';
import { RTCKotitonniPlayer } from '../../types';

import { initializePlayers } from '../../helpers/games';
import logger from '../../utils/logger';

const useNewKotitonniPlayers = () => {
  const [players, setPlayers] = React.useState<null | RTCKotitonniPlayer[]>(
    null
  );

  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const init = async () => {
      try {
        const initialPlayers = await initializePlayers(5, 3);
        setPlayers(initialPlayers);
      } catch (error) {
        logger.error('error initializing players for new game:', error.message);

        setError(error.message);
      }
    };

    init();
  }, []);

  return { players, setPlayers, error };
};

export default useNewKotitonniPlayers;
