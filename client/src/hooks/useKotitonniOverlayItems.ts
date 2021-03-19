import React from 'react';

import { useSelector, shallowEqual } from 'react-redux';
import { State } from '../types';

const useKotitonniOverlayItems = (playerId: string) => {
  const clickMap = useSelector(
    (state: State) => state.rtc.localData.clickedMap
  );
  const timer = useSelector((state: State) => state.rtc.localData.timer);
  const game = useSelector((state: State) => state.rtc.game);
  const player = useSelector(
    (state: State) => state.rtc.game?.players.find((p) => p.id === playerId),
    shallowEqual
  );

  const showPointAddition = React.useMemo(() => {
    if (timer === 0) {
      return true;
    }

    const values = Object.values(clickMap);

    return values.some((val) => !!val);
  }, [clickMap, timer]);

  const answer = React.useMemo(() => {
    if (!game?.info || !player?.privateData?.answers) {
      return null;
    }

    const { turn, round } = game.info;

    const answers = player.privateData.answers[turn];

    if (!answers || !answers[round] || !answers[round].length) {
      return null;
    }

    return answers[round];
  }, [game?.info]);

  const pointAddition = React.useMemo(() => {
    if (!game || !player) {
      return null;
    }

    const hasTurn = player.hasTurn;

    const playerCount = game.players.length;
    const correctAnswers = game.players.reduce((sum, next) => {
      return clickMap[next.id] ? sum + 1 : sum;
    }, 0);

    switch (correctAnswers) {
      case playerCount - 1:
        return hasTurn ? -50 : 0;
      case 0:
        return hasTurn ? -50 : 0;
      case 1:
        return clickMap[playerId] || hasTurn ? 100 : 0;
      case 2:
        return clickMap[playerId] || hasTurn ? 30 : 0;
      case 3:
        return clickMap[playerId] || hasTurn ? 10 : 0;
    }

    return correctAnswers;
  }, []);

  return {
    answer,
    pointAddition,
    game,
    player,
    showPointAddition,
  };
};

export default useKotitonniOverlayItems;
