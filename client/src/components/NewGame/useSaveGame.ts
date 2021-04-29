import React from 'react';
import logger from '../../utils/logger';

import gameService from '../../services/games';
import { GameStatus, GameType, RTCGame, RTCKotitonniPlayer } from '../../types';
import { useGames } from '../../context';

interface GameToAdd {
  startTime: Date;
  type: GameType;
  players: RTCKotitonniPlayer[];
  status: GameStatus;
  rounds: number;
  price: number;
  allowedSpectators: number;
}

const useSaveGame = () => {
  const [addedGame, setAddedGame] = React.useState<RTCGame | null>(null);
  const [loading, setLoading] = React.useState(false);
  const { setGames } = useGames();
  const [error, setError] = React.useState<string | null>(null);

  const saveGame = React.useCallback(
    async (gameToAdd: GameToAdd) => {
      setLoading(true);

      logger.log(`adding new game`, gameToAdd);

      try {
        const added = await gameService.addNew(gameToAdd);

        setAddedGame(added);

        // app-wide games
        setGames((games) => games.concat(added));
      } catch (e) {
        logger.error(`error adding game: ${e.message}`);

        setError(e.message);
      }

      setLoading(false);
    },
    [setGames]
  );

  return {
    saveGame,
    error,
    addedGame,
    loading,
  };
};

export default useSaveGame;
