import React from 'react';

import { useGameData } from '../../context';
import logger from '../../utils/logger';

interface TimerData {
  value: number;
  isRunning: boolean;
}

const useServerSideTimer = () => {
  const { socket } = useGameData();
  const [timerData, setTimerData] = React.useState<TimerData | null>(null);

  React.useEffect(() => {
    logger.log('adding listener for timer');

    socket.emit('get-timer-state', setTimerData);

    const handler = (data: TimerData) => {
      setTimerData({ value: data.value, isRunning: data.isRunning });
    };

    socket.on('timer-updated', handler);

    return () => {
      logger.log('removing listener for timer');

      socket.off('timer-updated', handler);
    };
  }, [socket]);

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
    if (timerData?.isRunning) {
      stopTimer();
    } else {
      startTimer();
    }
  }, [startTimer, stopTimer, timerData?.isRunning]);

  return {
    timerValue: timerData?.value ?? null,
    timerIsRunning: timerData?.isRunning ?? null,
    startTimer,
    stopTimer,
    resetTimer,
    toggleTimer,
  };
};

export default useServerSideTimer;