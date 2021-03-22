import React from 'react';
import logger from '../../utils/logger';

import gameService from '../../services/games';
import { GameStatus, GameType, RTCGame, RTCKotitonniPlayer } from '../../types';

interface GameToAdd {
  startTime: Date;
  type: GameType;
  players: RTCKotitonniPlayer[];
  status: GameStatus;
  rounds: number;
  price: number;
}

const useSaveGame = () => {
  const [addedGame, setAddedGame] = React.useState<RTCGame | null>(null);
  const [loading, setLoading] = React.useState(false);

  const [error, setError] = React.useState<string | null>(null);

  const saveGame = React.useCallback(async (gameToAdd: GameToAdd) => {
    setLoading(true);

    logger.log(`adding new game`, gameToAdd);

    try {
      const added = await gameService.addNew(gameToAdd);

      setAddedGame(added);
    } catch (e) {
      logger.error(`error adding game: ${e.message}`);

      setError(e.message);
    }

    setLoading(false);
  }, []);

  return {
    saveGame,
    error,
    addedGame,
    loading,
  };
};

export default useSaveGame;
