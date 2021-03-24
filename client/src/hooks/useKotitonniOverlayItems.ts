import React from 'react';

import { useSelector, shallowEqual } from 'react-redux';
import { State } from '../types';
import { useInGameTimer, useKotitonniData } from '../context';
import { getPointAddition } from '../helpers/games';

const useKotitonniOverlayItems = (playerId: string) => {
  const { clickedMap } = useKotitonniData();
  const { timerValue } = useInGameTimer();
  const game = useSelector((state: State) => state.rtc.game);
  const player = useSelector(
    (state: State) => state.rtc.game?.players.find((p) => p.id === playerId),
    shallowEqual
  );

  const showPointAddition = React.useMemo(() => {
    if (timerValue === 0) {
      return true;
    }

    const values = Object.values(clickedMap);

    return values.some((val) => !!val);
  }, [clickedMap, timerValue]);

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
      return 0;
    }

    return getPointAddition(game, clickedMap, player.id, !!player.hasTurn);
  }, [game, clickedMap, player]);

  return {
    answer,
    pointAddition,
    game,
    player,
    showPointAddition,
  };
};

export default useKotitonniOverlayItems;
