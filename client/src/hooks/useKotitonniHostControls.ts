import React from 'react';
import { useGameData, useKotitonniData } from '../context';
import { RTCGame, GameType, KotitonniUpdate } from '../types';
import logger from '../utils/logger';
import useGameHistory from './useGameHistory';
import { useInGameTimer } from '../context/index';
import { getPointAddition } from '../helpers/games';

const useKotitonniHostControls = () => {
  const {
    timerValue,
    timerIsRunning,
    toggleTimer,
    stopTimer,
  } = useInGameTimer();
  const { socket, game } = useGameData();
  const { clickedMap, resetClicks } = useKotitonniData();
  const {
    setHistory,
    returnToPrevious,
    noHistorySet,
    atHistory,
    setAtHistory,
  } = useGameHistory();

  const handleUpdate = React.useCallback(
    (newGame: RTCGame) => socket.emit('update-game', newGame),
    [socket]
  );

  const fetchLatestGameStatus = React.useCallback(() => {
    if (socket.disconnected) {
      logger.log('socket is disconnected, reconnecting');

      socket.connect();
    }

    socket.emit('get-game');
  }, [socket]);

  const handleFinish = React.useCallback(() => {
    socket.emit('end');
  }, [socket]);

  const handleStart = React.useCallback(() => {
    socket.emit('start');
  }, [socket]);

  const handlePointUpdate = React.useCallback(
    (game: RTCGame) => {
      setHistory(game);

      const pointMap: Record<string, number> = {};

      game.players.forEach((player) => {
        const newPoints =
          player.points +
          getPointAddition(
            game,
            clickedMap,
            player.id,
            player.id === game.info.turn
          );

        pointMap[player.id] = newPoints;
      });

      const update: KotitonniUpdate = {
        gameType: GameType.KOTITONNI,
        data: pointMap,
        fromHistory: atHistory,
      };

      logger.log('updating with:', update);

      socket.emit('update-game', update);

      resetClicks();
      setAtHistory(false);
    },
    [socket, clickedMap, resetClicks, setHistory, setAtHistory, atHistory]
  );

  const everyoneHasAnswered = React.useMemo(() => {
    return game.players.every((player) => {
      if (player.hasTurn) {
        return true;
      }

      const answers = player.privateData.answers[game.info.turn];

      return (
        answers && answers[game.info.round] && answers[game.info.round].length
      );
    });
  }, [game]);

  React.useEffect(() => {
    if (timerIsRunning && everyoneHasAnswered) {
      stopTimer();
    }
  }, [timerIsRunning, everyoneHasAnswered, stopTimer]);

  return {
    game,
    handleUpdate,
    fetchLatestGameStatus,
    handleFinish,
    handleStart,
    handlePointUpdate,
    returnToPrevious,
    noHistorySet,
    everyoneHasAnswered,
    timerValue,
    timerIsRunning,
    toggleTimer,
    atHistory,
  };
};

export default useKotitonniHostControls;
