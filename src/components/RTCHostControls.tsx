import React from 'react';

import useInterval from '../hooks/useInterval';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Fab, Paper } from '@material-ui/core';

import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import UndoIcon from '@material-ui/icons/Undo';
import { GameStatus, RTCGame, State } from '../types';
import { useDispatch, useSelector } from 'react-redux';
import logger from '../utils/logger';
import { reset, setTimer } from '../reducers/kotitonni.local.reducer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      backgroundColor: 'rgba(15, 17, 15)',
      position: 'relative',
    },
    btnContainer: {
      margin: theme.spacing(1),
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
    updatePoints: {
      backgroundColor: 'rgba(63, 120, 76)',
      color: 'white',
    },
    returnPoints: {
      backgroundColor: 'rgba(239, 100, 97)',
    },
    fullScreen: {
      color: 'white',
      margin: theme.spacing(1),
      alignSelf: 'center',
      position: 'absolute',
      right: '2%',
    },
    timerContainer: {
      textAlign: 'center',
      width: 30,
      backgroundImage: 'url(images/timer.png)',
    },
    timerBtn: {
      backgroundColor: 'secondary',
    },
  })
);

const RTCHostControls: React.FC = () => {
  const classes = useStyles();

  const [timerRunning, setTimerRunning] = React.useState<boolean>(false);
  const timer = useSelector((state: State) => state.rtc.localData.timer);

  const dispatch = useDispatch();
  const game = useSelector((state: State) => state.rtc.game);
  const socket = useSelector((state: State) => state.rtc.self?.socket);
  const clickMap = useSelector(
    (state: State) => state.rtc.localData.clickedMap
  );

  const handleUpdate = React.useCallback(
    (newGame: RTCGame) => {
      if (socket) {
        socket.emit('update-game', newGame);
      } else {
        logger.error('no socket when trying to emit update');
      }
    },
    [socket]
  );

  React.useEffect(() => {
    // sets answering open to false if everyone has answered
    if (game && game.info.answeringOpen) {
      const playerWithTurnId = game.info.turn;

      const everyoneHasAnswered = game.players.every((player) => {
        if (player.hasTurn) {
          return true;
        }

        const answers = player.answers[playerWithTurnId];

        return (
          answers && answers[game.info.round] && answers[game.info.round].length
        );
      });

      if (everyoneHasAnswered) {
        logger.log('everyone has answered, setting answering open to false');

        handleUpdate({
          ...game,
          info: {
            ...game.info,
            answeringOpen: false,
          },
        });
      }
    }
  }, [game, handleUpdate]);

  React.useEffect(() => {
    // sets answering open to false if timer reaches 0
    if (game && game.info.answeringOpen && timer === 0) {
      logger.log('timer is 0, setting answering open to false');

      handleUpdate({
        ...game,
        info: {
          ...game.info,
          answeringOpen: false,
        },
      });
    }
  }, [timer, game, handleUpdate]);

  useInterval(
    () => {
      if (timer === 1) {
        setTimerRunning(false);
      }

      if (socket) {
        socket.emit('timer', timer - 1);
      } else {
        console.error('no socket set when trying to emit timer change');
      }

      dispatch(setTimer(timer - 1));
    },
    timerRunning
      ? // eslint-disable-next-line no-undef
        process && process.env.NODE_ENV === 'development'
        ? 10
        : 1000
      : null
  );

  const toggleTimer = () => {
    if (game && !game.info.answeringOpen && timer === 60) {
      logger.log('setting answering open to true');

      handleUpdate({
        ...game,
        info: {
          ...game.info,
          answeringOpen: true,
        },
      });
    }

    setTimerRunning((current) => !current);
  };

  const handlePointUpdate = () => {
    if (!game) {
      logger.error('no game set when trying to update');

      return;
    }

    if (!socket) {
      logger.error('no socket set when trying to update');

      return;
    }

    const playerInTurn = game.players.find((player) => player.hasTurn);

    if (!playerInTurn) {
      logger.error('no player with turn set when trying to update');

      return;
    }

    const getPointAddition = (playerId: string, hasTurn: boolean): number => {
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
    };

    const newPlayers = game.players.map((player) => {
      return {
        ...player,
        points: player.points + getPointAddition(player.id, !!player.hasTurn),
      };
    });

    const playerInTurnIndex = game.players.indexOf(playerInTurn);
    let round: number;
    let turn: string;

    if (playerInTurnIndex === game.players.length - 1) {
      round = game.info.round + 1;
      turn = game.players[0].id;
    } else {
      round = game.info.round;
      turn = game.players[playerInTurnIndex + 1].id;
    }

    const updatedGame = {
      ...game,
      status: round > 3 ? GameStatus.FINISHED : game.status,
      players: newPlayers,
      info: {
        ...game.info,
        round,
        turn,
      },
    };

    socket.emit('update-game', updatedGame);

    if (timerRunning) {
      setTimerRunning(false);
    }

    dispatch(reset());
  };

  return (
    <Paper elevation={3} className={classes.container} square>
      {game?.status === GameStatus.FINISHED ? (
        <div className={classes.btnContainer}>
          <Fab variant="extended" color="secondary" onClick={() => null}>
            Lopeta peli
          </Fab>
        </div>
      ) : (
        <>
          <div className={classes.btnContainer}>
            <Fab
              variant="extended"
              size="large"
              color={timerRunning ? 'primary' : 'secondary'}
              onClick={toggleTimer}
            >
              {timerRunning ? <PauseIcon /> : <PlayArrowIcon />}
              <div className={classes.timerContainer}>{timer}</div>
            </Fab>
          </div>
          <div className={classes.btnContainer}>
            <Fab
              variant="extended"
              color="secondary"
              onClick={handlePointUpdate}
              disabled={!game ? true : game.info.answeringOpen}
            >
              Päivitä pisteet
            </Fab>
          </div>
          <div className={classes.btnContainer}>
            <Fab size="medium" color="secondary">
              <UndoIcon />
            </Fab>
          </div>
        </>
      )}
    </Paper>
  );
};

export default RTCHostControls;
