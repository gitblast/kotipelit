import React from 'react';
import useServerSideTimer from './useServerSideTimer';
import { InGameTimerProvider } from '../../context';

interface TimerProviderProps {
  children: React.ReactNode;
}

// will throw error if not inside a socket provider
const TimerProvider = ({ children }: TimerProviderProps) => {
  const timerData = useServerSideTimer();

  return (
    <InGameTimerProvider value={timerData}>{children}</InGameTimerProvider>
  );
};

export default TimerProvider;
