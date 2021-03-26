import React from 'react';

const useAudioOnIncreaseRef = (
  ref: React.MutableRefObject<HTMLAudioElement | null>,
  currentCount: number | null
) => {
  const previousCountRef = React.useRef<null | number>(null);

  React.useEffect(() => {
    if (
      ref.current &&
      (currentCount || currentCount === 0) &&
      (previousCountRef.current || previousCountRef.current === 0) &&
      currentCount > previousCountRef.current
    ) {
      ref.current.currentTime = 0; // this makes the audio play over even if it has not yet finished
      ref.current.play();
    }

    previousCountRef.current = currentCount;
  }, [currentCount, ref]);

  return ref;
};

export default useAudioOnIncreaseRef;
