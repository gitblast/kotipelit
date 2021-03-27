import React from 'react';

const usePointChangeAudioRef = (
  currentPoints: number,
  ref: React.MutableRefObject<HTMLAudioElement | null>,
  delta: number
) => {
  const previousPointsRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (
      ref.current &&
      (currentPoints || currentPoints === 0) &&
      (previousPointsRef.current || previousPointsRef.current === 0) &&
      currentPoints - previousPointsRef.current === delta
    ) {
      ref.current.play();
    }

    previousPointsRef.current = currentPoints;
  }, [currentPoints, ref, delta]);

  return ref;
};

export default usePointChangeAudioRef;
