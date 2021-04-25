import React from 'react';

import { useInGameTimer, useKotitonniData, useGameData } from '../context';
import { getPointAddition, getNextRoundAndTurn } from '../helpers/games';
import { Role, RTCKotitonniPlayer } from '../types';
import logger from '../utils/logger';
import useGameHistory from './useGameHistory';

const useCorrectAnswerSetter = (
  playerId: string,
  answer: string | null,
  players: RTCKotitonniPlayer[]
) => {
  const [handled, setHandled] = React.useState(false);

  const { setClicked } = useKotitonniData();

  // correct answers as a joint string, eg. tunneli-palaveri-liipasin
  const correctAnwersAsString = React.useMemo(
    () =>
      players
        .find((p) => p.hasTurn)
        ?.privateData?.words.join('-')
        .toLowerCase(),
    [players]
  );

  React.useEffect(() => {
    if (
      !handled &&
      answer &&
      correctAnwersAsString?.includes(answer.toLowerCase())
    ) {
      setClicked(playerId, true);
      setHandled(true);
    }
  }, [playerId, answer, correctAnwersAsString, setClicked, handled]);

  React.useEffect(() => {
    setHandled(false);
  }, [correctAnwersAsString]);
};

const useKotitonniOverlayItems = (playerId: string) => {
  const { clickedMap } = useKotitonniData();
  const { timerValue } = useInGameTimer();
  const { game, self, socket } = useGameData();
  const { setHistory } = useGameHistory();
  const player = React.useMemo(
    () => game.players.find((p) => p.id === playerId),
    [game.players, playerId]
  );

  const skipPlayer = React.useCallback(() => {
    setHistory(game);

    const { round, turn } = getNextRoundAndTurn(game);

    const updatedGame = {
      ...game,
      info: {
        ...game.info,
        round,
        turn,
      },
    };

    logger.log('updating game with', updatedGame);

    socket.emit('update-game', updatedGame);
  }, [socket, game, setHistory]);

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
