import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Fab, Grid, Typography, IconButton } from '@material-ui/core';

import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import UndoIcon from '@material-ui/icons/Undo';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import { GameStatus, RTCGame, State } from '../types';
import { useDispatch, useSelector } from 'react-redux';
import logger from '../utils/logger';
import { reset } from '../reducers/kotitonni.local.reducer';
import InfoBar from './InfoBar';
import { useHistory, useParams } from 'react-router-dom';
import { InGameSocket } from '../context';
import MainKotitonniButton from './MainKotitonniButton';
import useGameHistory from '../hooks/useGameHistory';
import useTimer from '../hooks/useTimer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      position: 'relative',
    },
    btnContainer: {
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    controlsContent: {
      paddingTop: theme.spacing(0.5),
      paddingBottom: theme.spacing(3),
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1),
      },
    },
    controlBarIcons: {
      color: 'white',
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
    timerButton: {
      background: 'linear-gradient(to bottom, rgb(36 170 167), rgb(33 36 36))',
      color: 'white',
      boxShadow: 'rgb(231 239 191) 4px 3px 18px',
      padding: 36,
      border: 'solid',
      borderColor: 'white',
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(3.5),
      },
    },
    returnPoints: {
      background: 'linear-gradient(to bottom, rgb(36 170 167), rgb(33 36 36))',
      boxShadow: 'rgb(231 239 191) 4px 3px 18px',
      padding: 26,
      border: 'solid',
      borderColor: 'white',
    },
    undoArrow: {
      color: 'white',
    },
    fullScreen: {
      color: 'white',
      margin: theme.spacing(1),
      alignSelf: 'center',
      position: 'absolute',
      right: '2%',
    },

    timerBtn: {
      backgroundColor: 'secondary',
    },
  })
);

const RTCHostControls: React.FC<{
  handleToggleFullscreen: () => void;
}> = ({ handleToggleFullscreen }) => {
  const {
    timerValue: timer,
    timerIsRunning: timerRunning,
    startTimer,
    stopTimer,
    resetTimer,
  } = useTimer();
  const { setHistory, returnToPrevious, noHistorySet } = useGameHistory();
  const classes = useStyles();
  const history = useHistory();
  const params = useParams<{ username: string }>();
  const dispatch = useDispatch();
  const game = useSelector((state: State) => state.rtc.game);
  const socket = React.useContext(InGameSocket);
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

        const answers = player.privateData.answers[playerWithTurnId];

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

  const toggleTimer = () => {
    if (timerRunning) {
      stopTimer();
    } else {
      startTimer();
    }
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

    setHistory(game);

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

    const updatedGame: RTCGame = {
      ...game,
      status: round > 3 ? GameStatus.FINISHED : game.status,
      players: newPlayers,
      info: {
        ...game.info,
        round,
        turn,
      },
    };

    logger.log('updating game with', updatedGame);

    socket.emit('update-game', updatedGame);

    resetTimer();
    dispatch(reset());
  };

  const fetchLatestGameStatus = () => {
    if (!socket) {
      logger.error('no socket set when trying to fetch new game status');

      return;
    }

    if (socket.disconnected) {
      logger.log('socket is disconnected, reconnecting');

      socket.connect();
    }

    socket.emit('get-room-game');
  };

  const handleFinish = () => {
    if (!socket) {
      logger.error('no socket set when trying to emit finish game');

      return;
    }

    socket.emit('end');

    if (!params?.username) {
      logger.error('no username in params when trying to redirect');

      return;
    }

    history.push(`/${params.username}/kiitos`);
  };

  const handleStart = () => {
    if (socket) {
      socket.emit('start');
    } else {
      logger.error('socket was null when trying to emit start');
    }
  };

  if (!game) {
    return null;
  }

  return (
    <div className={classes.container}>
      <Grid container className={classes.controlsContent}>
        <Grid item md={1}></Grid>
        <Grid item md={3} sm={3}>
          {game.status === GameStatus.RUNNING && <InfoBar />}
        </Grid>
        <Grid item md={4} sm={6} className={classes.btnContainer}>
          {game.status === GameStatus.RUNNING && (
            <Fab
              size="large"
              color={timerRunning ? 'primary' : 'secondary'}
              onClick={() => {
                toggleTimer();
                fetchLatestGameStatus();
              }}
              className={classes.timerButton}
            >
              {timerRunning ? <PauseIcon /> : <PlayArrowIcon />}
              <Typography variant="h6">{timer}</Typography>
            </Fab>
          )}
          <MainKotitonniButton
            game={game}
            handleStart={handleStart}
            handleFinish={handleFinish}
            handlePointUpdate={handlePointUpdate}
          />
          {game.status === GameStatus.RUNNING && (
            <Fab
              size="medium"
              color="secondary"
              onClick={returnToPrevious}
              disabled={noHistorySet}
              className={classes.returnPoints}
            >
              <UndoIcon className={classes.undoArrow} />
            </Fab>
          )}
        </Grid>
        <Grid item md={2} sm={3}></Grid>
        <Grid item md={2}>
          <IconButton
            className={classes.controlBarIcons}
            onClick={handleToggleFullscreen}
          >
            <FullscreenIcon fontSize="large"></FullscreenIcon>
          </IconButton>
        </Grid>
      </Grid>
    </div>
  );
};

export default RTCHostControls;
