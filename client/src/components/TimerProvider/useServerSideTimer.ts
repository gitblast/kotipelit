import React from 'react';

import { useGameData } from '../../context';

const useServerSideTimer = () => {
  const { socket, game } = useGameData();

  const timer = React.useMemo(() => game.info.timer, [game.info.timer]);

  const startTimer = React.useCallback(() => {
    socket.emit('handle-timer', 'start');
  }, [socket]);

  const stopTimer = React.useCallback(() => {
    socket.emit('handle-timer', 'stop');
  }, [socket]);

  const resetTimer = React.useCallback(() => {
    socket.emit('handle-timer', 'reset');
  }, [socket]);

  const toggleTimer = React.useCallback(() => {
    if (timer.isRunning) {
      stopTimer();
    } else {
      startTimer();
    }
  }, [startTimer, stopTimer, timer.isRunning]);

  return {
    timerValue: timer.value,
    timerIsRunning: timer.isRunning,
    startTimer,
    stopTimer,
    resetTimer,
    toggleTimer,
  };
};

export default useServerSideTimer;
