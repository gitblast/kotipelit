import React from 'react';
import { useSelector } from 'react-redux';
import { State } from '../types';

export const selector = (state: State) => {
  const game = state.rtc.game;

  if (!game) {
    return null;
  }
  return game.players.map((player) => player.points);
};

const useAnyPointChangeAudioRef = (
  ref: React.MutableRefObject<HTMLAudioElement | null>,
  delta: number
) => {
  const pointsArray = useSelector(selector);
  const previousPointsRef = React.useRef<number[] | null>(null);

  React.useEffect(() => {
    if (
      ref.current &&
      pointsArray &&
      previousPointsRef.current &&
      pointsArray.some((points, index) => {
        if (previousPointsRef.current === null) {
          return false;
        }

        return points - previousPointsRef.current[index] === delta;
      })
    ) {
      ref.current.play();
    }

    previousPointsRef.current = pointsArray;
  }, [pointsArray, ref, delta]);

  return ref;
};

export default useAnyPointChangeAudioRef;
