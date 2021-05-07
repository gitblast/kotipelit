import React from 'react';

import { useInGameTimer, useKotitonniData, useGameData } from '../context';
import { getPointAddition } from '../helpers/games';
import { Role, RTCKotitonniPlayer, KotitonniUpdate, GameType } from '../types';
import logger from '../utils/logger';
import useGameHistory from './useGameHistory';

const useCorrectAnswerSetter = (
  playerId: string,
  answer: string | null,
  players: RTCKotitonniPlayer[]
) => {
  const [handled, setHandled] = React.useState(false);

  const { setClicked } = useKotitonniData();

  const correctAnwersArray = React.useMemo(() => {
    return (
      players
        .find((p) => p.hasTurn)
        ?.privateData?.words.map((w) => w.toLowerCase()) ?? []
    );
  }, [players]);

  const correctAnswerString = correctAnwersArray.join('').toLowerCase();

  React.useEffect(() => {
    if (
      !handled &&
      answer &&
      correctAnwersArray.includes(answer.toLowerCase())
    ) {
      setClicked(playerId, true);
      setHandled(true);
    }
  }, [playerId, answer, correctAnwersArray, setClicked, handled]);

  React.useEffect(() => {
    setHandled(false);
  }, [correctAnswerString]);
};

const useKotitonniOverlayItems = (playerId: string) => {
  const { clickedMap, resetClicks } = useKotitonniData();
  const { timerValue, timerIsRunning } = useInGameTimer();
  const { game, self, socket } = useGameData();
  const { setHistory, setAtHistory, atHistory } = useGameHistory();
  const player = React.useMemo(
    () => game.players.find((p) => p.id === playerId),
    [game.players, playerId]
  );

  const skipPlayer = React.useCallback(() => {
    if (timerIsRunning) {
      logger.error('cannot skip when timer is running');

      return;
    }

    setHistory(game);

    const pointMap: Record<string, number> = {};

    game.players.forEach((player) => {
      pointMap[player.id] = player.points;
    });

    const update: KotitonniUpdate = {
      gameType: GameType.KOTITONNI,
      data: pointMap,
      fromHistory: atHistory,
    };

    logger.log('updating with:', update);

    socket.emit('update-game', update);

    resetClicks();
    setAtHistory(false);
  }, [
    socket,
    game,
    setHistory,
    resetClicks,
    timerIsRunning,
    setAtHistory,
    atHistory,
  ]);

  const showPointAddition = React.useMemo(() => {
    if (timerValue === 0) {
      return true;
    }

    const values = Object.values(clickedMap);

    return values.some((val) => !!val);
  }, [clickedMap, timerValue]);

  const answer = React.useMemo(() => {
    if (!player?.privateData?.answers) {
      return null;
    }

    const { turn, round } = game.info;

    const answers = player.privateData.answers[turn];

    if (!answers || !answers[round] || !answers[round].length) {
      return null;
    }

    return answers[round];
  }, [game.info, player?.privateData?.answers]);

  const pointAddition = React.useMemo(() => {
    if (!player) {
      return 0;
    }

    return getPointAddition(game, clickedMap, player.id, !!player.hasTurn);
  }, [game, clickedMap, player]);

  useCorrectAnswerSetter(playerId, answer, game.players);

  return {
    answer,
    pointAddition,
    game,
    player,
    showPointAddition,
    forHost: self.role === Role.HOST,
    skipPlayer,
  };
};

export default useKotitonniOverlayItems;
