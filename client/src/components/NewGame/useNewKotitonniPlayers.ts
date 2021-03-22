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
      const initialPlayers = await initializePlayers(5, 3);
      setPlayers(initialPlayers);
    };

    try {
      init();
    } catch (error) {
      logger.error('error initializing players for new game:', error.message);

      setError(error.message);
    }
  }, []);

  return { players, error };
};

export default useNewKotitonniPlayers;
