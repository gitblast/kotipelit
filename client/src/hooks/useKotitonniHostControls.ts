import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { useInGameSocket, useKotitonniData } from '../context';
import { getNextKotitonniState } from '../helpers/games';
import { RTCGame, State } from '../types';
import logger from '../utils/logger';
import useGameHistory from './useGameHistory';
import { useInGameTimer } from '../context/index';

const useKotitonniHostControls = () => {
  const game = useSelector((state: State) => state.rtc.game);

  const {
    timerValue,
    timerIsRunning,
    toggleTimer,
    resetTimer,
  } = useInGameTimer();
  const socket = useInGameSocket();
  const { clickedMap, resetClicks } = useKotitonniData();
  const { setHistory, returnToPrevious, noHistorySet } = useGameHistory();
  const history = useHistory();
  const params = useParams<{ username: string }>();

  const handleUpdate = React.useCallback(
    (newGame: RTCGame) => socket.emit('update-game', newGame),
    [socket]
  );

  const fetchLatestGameStatus = React.useCallback(() => {
    if (socket.disconnected) {
      logger.log('socket is disconnected, reconnecting');

      socket.connect();
    }

    socket.emit('get-room-game');
  }, [socket]);

  const handleFinish = React.useCallback(() => {
    socket.emit('end');

    history.push(`/${params.username}/kiitos`);
  }, [socket, params, history]);

  const handleStart = React.useCallback(() => {
    socket.emit('start');
  }, [socket]);

  const handlePointUpdate = React.useCallback(
    (game: RTCGame) => {
      setHistory(game);

      const updatedGame = getNextKotitonniState(game, clickedMap);

      logger.log('updating game with', updatedGame);

      socket.emit('update-game', updatedGame);

      resetTimer();
      resetClicks();
    },
    [socket, clickedMap, resetTimer, resetClicks, setHistory]
  );

  const everyoneHasAnswered = React.useMemo(() => {
    if (!game) {
      logger.error('no game set');

      return false;
    }

    return game.players.every((player) => {
      if (player.hasTurn) {
        return true;
      }

      const answers = player.privateData.answers[game.info.turn];

      return (
        answers && answers[game.info.round] && answers[game.info.round].length
      );
    });
  }, [game]);

  return {
    game,
    handleUpdate,
    fetchLatestGameStatus,
    handleFinish,
    handleStart,
    handlePointUpdate,
    returnToPrevious,
    noHistorySet,
    everyoneHasAnswered,
    timerValue,
    timerIsRunning,
    toggleTimer,
  };
};

export default useKotitonniHostControls;
