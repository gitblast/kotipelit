import React from 'react';

import { useSelector, shallowEqual } from 'react-redux';
import { State } from '../types';
import { getPointAddition } from '../helpers/games';

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
      return 0;
    }

    return getPointAddition(game, clickMap, player.id, !!player.hasTurn);
  }, [game, clickMap, player]);

  return {
    answer,
    pointAddition,
    game,
    player,
    showPointAddition,
  };
};

export default useKotitonniOverlayItems;