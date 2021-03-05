import React from 'react';
import { useSelector } from 'react-redux';
import { GameStatus, State } from '../types';

/**
 * Plays audio when status changes from oldStatus to newStatus
 * @param ref
 * @param oldStatus
 * @param newStatus
 */
const useStatusChangeAudioRef = (
  ref: React.MutableRefObject<HTMLAudioElement | null>,
  oldStatus: GameStatus,
  newStatus: GameStatus
) => {
  const gameStatus = useSelector((state: State) => {
    return state.rtc.game ? state.rtc.game.status : null;
  });

  const previousStatus = React.useRef<null | GameStatus>(null);

  React.useEffect(() => {
    if (
      previousStatus.current === oldStatus &&
      gameStatus === newStatus &&
      ref.current
    ) {
      ref.current.play();
    }

    previousStatus.current = gameStatus;
  }, [gameStatus, ref, oldStatus, newStatus]);

  return ref;
};

export default useStatusChangeAudioRef;
