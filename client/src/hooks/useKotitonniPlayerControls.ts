import React from 'react';

import { useGameData } from '../context';
import { KotitonniInfo } from '../types';
import logger from '../utils/logger';
import { useInGameTimer } from '../context';

const useKotitonniPlayerControls = () => {
  const { socket, self, game } = useGameData();

  const playerSelf = React.useMemo(
    () => game.players.find((player) => player.id === self.id),
    [game.players, self.id]
  );

  const { timerValue, timerIsRunning } = useInGameTimer();

  const answeringDisabled = React.useMemo(() => {
    if (
      !playerSelf ||
      playerSelf.hasTurn ||
      (!timerIsRunning && (timerValue === 0 || timerValue === 60))
    ) {
      return true;
    }

    if (!playerSelf.privateData.answers[game.info.turn]) {
      return false;
    }

    const answer =
      playerSelf.privateData.answers[game.info.turn][game.info.round];

    return !!answer;
  }, [game, playerSelf, timerIsRunning, timerValue]);

  const handleAnswer = React.useCallback(
    (answer: string, gameInfo: KotitonniInfo) => {
      if (answer.length) {
        const answerObj = {
          answer,
          info: gameInfo,
        };

        socket.emit('answer', answerObj);
      }
    },
    [socket]
  );

  const fetchLatestGameStatus = React.useCallback(() => {
    if (socket.disconnected) {
      logger.log('socket is disconnected, reconnecting');

      socket.connect();
    }

    socket.emit('get-room-game');
  }, [socket]);

  return {
    handleAnswer,
    fetchLatestGameStatus,
    answeringDisabled,
    game,
    timerValue,
  };
};

export default useKotitonniPlayerControls;
