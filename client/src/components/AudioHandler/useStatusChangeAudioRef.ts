import React from 'react';
import { GameStatus } from '../../types';

/**
 * Plays audio when status changes from oldStatus to newStatus
 * @param ref
 * @param currentStatus
 * @param oldStatus
 * @param newStatus
 */
const useStatusChangeAudioRef = (
  ref: React.MutableRefObject<HTMLAudioElement | null>,
  currentStatus: GameStatus,
  oldStatus: GameStatus,
  newStatus: GameStatus
) => {
  const previousStatus = React.useRef<null | GameStatus>(null);

  React.useEffect(() => {
    if (
      previousStatus.current === oldStatus &&
      currentStatus === newStatus &&
      ref.current
    ) {
      ref.current.play();
    }

    previousStatus.current = currentStatus;
  }, [currentStatus, ref, oldStatus, newStatus]);

  return ref;
};

export default useStatusChangeAudioRef;
