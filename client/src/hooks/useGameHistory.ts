import React from 'react';
import logger from '../utils/logger';
import { useGameData, useInGameHistory } from '../context';

const useGameHistory = () => {
  const { history, setHistory, atHistory, setAtHistory } = useInGameHistory();
  const { updateGame } = useGameData();

  const returnToPrevious = React.useCallback(() => {
    if (!history) {
      logger.log('no history set');

      return;
    }

    const previousGameState = {
      ...history,
    };

    logger.log('returning to game state:', previousGameState);

    setHistory(null);
    setAtHistory(true);

    updateGame(previousGameState);
  }, [updateGame, history, setHistory, setAtHistory]);

  return {
    setHistory,
    returnToPrevious,
    noHistorySet: !history,
    atHistory,
    setAtHistory,
  };
};

export default useGameHistory;
