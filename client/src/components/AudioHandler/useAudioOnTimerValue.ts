import React from 'react';
import { useInGameTimer } from '../../context';

const useAudioOnTimerValue = (
  ref: React.MutableRefObject<HTMLAudioElement | null>,
  playOnValue = 10
) => {
  const { timerValue } = useInGameTimer();

  React.useEffect(() => {
    if (ref.current && timerValue === playOnValue) {
      ref.current.play();
    }
  }, [timerValue, playOnValue, ref]);

  return ref;
};

export default useAudioOnTimerValue;
