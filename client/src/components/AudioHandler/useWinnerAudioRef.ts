import React from 'react';

const useWinnerAudioRef = (
  isWinner: boolean,
  ref: React.MutableRefObject<HTMLAudioElement | null>
) => {
  React.useEffect(() => {
    if (ref.current && isWinner) {
      ref.current.play();
    }
  }, [ref, isWinner]);

  return ref;
};

export default useWinnerAudioRef;
