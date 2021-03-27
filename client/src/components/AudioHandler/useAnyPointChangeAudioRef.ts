import React from 'react';

const useAnyPointChangeAudioRef = (
  pointsArray: number[] | null,
  ref: React.MutableRefObject<HTMLAudioElement | null>,
  delta: number
) => {
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
