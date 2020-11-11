import React from 'react';
import { useSelector } from 'react-redux';
import { State } from '../types';

export const answerCountSelector = (state: State) => {
  if (!state.rtc.game) {
    return null;
  }

  let answerCount = 0;

  state.rtc.game.players.forEach((player) => {
    Object.values(player.answers).forEach((answerMap) => {
      answerCount += Object.values(answerMap).length;
    });
  });

  return answerCount;
};

export const clickCountSelector = (state: State) => {
  if (!state.rtc.localData?.clickedMap) {
    return null;
  }

  return Object.values(state.rtc.localData.clickedMap).reduce((total, next) => {
    return next ? total + 1 : total;
  }, 0);
};

const useAudioOnIncreaseRef = (
  ref: React.MutableRefObject<HTMLAudioElement | null>,
  selector: (state: State) => number | null
) => {
  const count = useSelector(selector);

  const previousCountRef = React.useRef<null | number>(null);

  React.useEffect(() => {
    if (
      ref.current &&
      (count || count === 0) &&
      (previousCountRef.current || previousCountRef.current === 0) &&
      count > previousCountRef.current
    ) {
      ref.current.currentTime = 0; // this makes the audio play over even if it has not yet finished
      ref.current.play();
    }

    previousCountRef.current = count;
  }, [count, ref]);

  return ref;
};

export default useAudioOnIncreaseRef;
