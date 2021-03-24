import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';

import { useInGameSocket } from '../context';
import { State, KotitonniInfo } from '../types';
import logger from '../utils/logger';
import { useInGameTimer } from '../context';

const useKotitonniPlayerControls = () => {
  const game = useSelector((state: State) => state.rtc.game);
  const socket = useInGameSocket();

  const playerSelf = useSelector((state: State) => {
    const self = state.rtc.self;

    if (!self) {
      return null;
    }

    return state.rtc.game?.players.find((player) => player.id === self.id);
  }, shallowEqual);

  const { timerValue, timerIsRunning } = useInGameTimer();

  const answeringDisabled = React.useMemo(() => {
    if (
      !game ||
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
