import React from 'react';
import { useSelector } from 'react-redux';
import { GameStatus, State } from '../types';

export const selector = (state: State) => {
  const game = state.rtc.game;

  if (!game || game.status !== GameStatus.FINISHED) {
    return null;
  }

  const self = state.rtc.self;

  if (!self) {
    return null;
  }

  const playerSelf = game.players.find((player) => player.id === self.id);

  if (!playerSelf) {
    return null;
  }

  const playersSortedByPoints = game.players.sort(
    (a, b) => b.points - a.points
  );

  return playersSortedByPoints[0].points === playerSelf.points;
};

const useWinnerAudioRef = (
  ref: React.MutableRefObject<HTMLAudioElement | null>
) => {
  const isWinner = useSelector(selector);

  React.useEffect(() => {
    if (ref.current && isWinner) {
      ref.current.play();
    }
  }, [ref, isWinner]);

  return ref;
};

export default useWinnerAudioRef;
