import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { useInGameSocket } from '../context';
import { getNextKotitonniState } from '../helpers/games';
import { reset } from '../reducers/kotitonni.local.reducer';
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
  const dispatch = useDispatch();
  const clickMap = useSelector(
    (state: State) => state.rtc.localData.clickedMap
  );
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

    if (!params?.username) {
      logger.error('no username in params when trying to redirect');

      return;
    }

    history.push(`/${params.username}/kiitos`);
  }, [socket, params]);

  const handleStart = React.useCallback(() => {
    socket.emit('start');
  }, [socket]);

  const handlePointUpdate = React.useCallback(
    (game: RTCGame) => {
      setHistory(game);

      const updatedGame = getNextKotitonniState(game, clickMap);

      logger.log('updating game with', updatedGame);

      socket.emit('update-game', updatedGame);

      resetTimer();
      dispatch(reset());
    },
    [socket, dispatch, clickMap]
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
