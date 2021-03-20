import React from 'react';
import { Socket } from 'socket.io-client';

import { InGameSocket } from '../context';
import logger from '../utils/logger';

interface TimerData {
  value: number;
  isRunning: boolean;
}

const useTimer = () => {
  const socket = React.useContext<Socket>(InGameSocket);
  const [timerData, setTimerData] = React.useState<TimerData | null>(null);

  React.useEffect(() => {
    logger.log('adding listener for timer');

    socket.emit('get-timer-state', setTimerData);

    socket.on('timer-updated', (data: TimerData) => {
      setTimerData({ value: data.value, isRunning: data.isRunning });
    });
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

  return {
    timerValue: timerData?.value ?? null,
    timerIsRunning: timerData?.isRunning ?? null,
    startTimer,
    stopTimer,
    resetTimer,
  };
};

export default useTimer;
