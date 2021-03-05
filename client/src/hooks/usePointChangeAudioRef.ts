import React from 'react';
import { useSelector } from 'react-redux';
import { State } from '../types';

export const selector = (state: State) => {
  const self = state.rtc.self;

  if (!self) {
    return null;
  }

  if (!state.rtc.game) {
    return null;
  }

  const playerSelf = state.rtc.game.players.find(
    (player) => player.id === self.id
  );

  if (!playerSelf) {
    return null;
  }

  return playerSelf.points;
};

const usePointChangeAudioRef = (
  ref: React.MutableRefObject<HTMLAudioElement | null>,
  delta: number
) => {
  const points = useSelector(selector);
  const previousPointsRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (
      ref.current &&
      (points || points === 0) &&
      (previousPointsRef.current || previousPointsRef.current === 0) &&
      points - previousPointsRef.current === delta
    ) {
      ref.current.play();
    }

    previousPointsRef.current = points;
  }, [points, ref, delta]);

  return ref;
};

export default usePointChangeAudioRef;
