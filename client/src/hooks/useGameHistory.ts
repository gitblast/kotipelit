import React from 'react';
import { useDispatch } from 'react-redux';
import { setGame } from '../reducers/rtcGameSlice';
import { RTCGame } from '../types';
import logger from '../utils/logger';

const useGameHistory = () => {
  const historyRef = React.useRef<RTCGame | null>(null);
  const dispatch = useDispatch();

  const setHistory = React.useCallback((game: RTCGame) => {
    historyRef.current = game;
  }, []);

  const returnToPrevious = React.useCallback(() => {
    const previousState = historyRef.current;

    if (!previousState) {
      logger.log('no history set');

      return;
    }

    const previousGameState = {
      ...previousState,
      info: {
        ...previousState.info,
        answeringOpen: false,
      },
    };

    logger.log('returning to game state:', previousGameState);

    historyRef.current = null;

    dispatch(setGame(previousGameState));
  }, [dispatch]);

  return {
    setHistory,
    returnToPrevious,
    noHistorySet: !historyRef.current,
  };
};

export default useGameHistory;
