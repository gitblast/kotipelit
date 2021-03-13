import React from 'react';

import FullscreenIcon from '@material-ui/icons/Fullscreen';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  Fab,
  TextField,
  Typography,
  Grid,
  IconButton,
} from '@material-ui/core';
import { shallowEqual, useSelector } from 'react-redux';
import { State } from '../types';
import logger from '../utils/logger';

import InfoBar from './InfoBar';

import { InGameSocket } from '../context';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
    },
    controlsContent: {
      paddingTop: theme.spacing(0.5),
      paddingBottom: theme.spacing(3),
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1),
      },
    },
    btnContainer: {
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    sendAnswerBtn: {
      background: 'linear-gradient(to bottom, rgb(36 170 167), rgb(33 36 36))',
      color: 'white',
      boxShadow: 'rgb(231 239 191) 4px 3px 18px',
      padding: theme.spacing(4),
      margin: theme.spacing(1),
      border: 'solid',
      borderColor: 'white',
    },
    timer: {
      color: 'white',
      margin: theme.spacing(1),
      fontSize: 45,
    },
    answerField: {
      // backgroundColor: 'white',
    },
    // Repeat from RTCHostControls
    fsIcon: {
      color: 'white',
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
  })
);

const RTCPlayerControls: React.FC<{
  handleToggleFullscreen: () => void;
}> = ({ handleToggleFullscreen }) => {
  const classes = useStyles();
  const [answer, setAnswer] = React.useState<string>('');
  const timer = useSelector((state: State) => state.rtc.localData.timer);
  const game = useSelector((state: State) => state.rtc.game);
  const self = useSelector((state: State) => state.rtc.self);
  const socket = React.useContext(InGameSocket);
  const playerSelf = useSelector((state: State) => {
    if (!self) {
      return null;
    }

    return state.rtc.game?.players.find((player) => player.id === self.id);
  }, shallowEqual);

  const isDisabled = () => {
    if (
      !game ||
      !game.info.answeringOpen ||
      !playerSelf ||
      !playerSelf.privateData.answers ||
      playerSelf.hasTurn
    ) {
      return true;
    }

    if (!playerSelf.privateData.answers[game.info.turn]) {
      return false;
    }

    const answer =
      playerSelf.privateData.answers[game.info.turn][game.info.round];

    return !!answer;
  };

  const handleAnswer = () => {
    if (!socket || !game) {
      logger.error('socket object or game missing when trying to emit');

      return;
    }

    if (answer.length) {
      const answerObj = {
        answer,
        info: game.info,
      };

      socket.emit('answer', answerObj);

      setAnswer('');
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    handleAnswer();
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (!isDisabled() && event.keyCode === 13) {
      handleAnswer();
    }
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

  return (
    <div className={classes.container}>
      <Grid container className={classes.controlsContent}>
        <Grid item md={1}></Grid>
        <Grid item md={3} sm={3}>
          <InfoBar />
        </Grid>

        <Grid item md={4} sm={8}>
          <form
            onSubmit={handleSubmit}
            onKeyPress={handleKeyPress}
            className={classes.btnContainer}
          >
            <Typography className={classes.timer} variant="h6">
              {timer}
            </Typography>

            <div className={classes.answerField}>
              <TextField
                variant="filled"
                label="Vastaus.."
                value={answer}
                onChange={({ target }) => setAnswer(target.value)}
                disabled={isDisabled()}
                onClick={fetchLatestGameStatus}
              />
            </div>

            <Fab
              className={classes.sendAnswerBtn}
              type="submit"
              variant="extended"
              disabled={isDisabled()}
            >
              <Typography variant="h6">Vastaa</Typography>
            </Fab>
          </form>
        </Grid>
        <Grid item md={2}></Grid>
        <Grid item md={2} sm={1}>
          <IconButton
            className={classes.fsIcon}
            onClick={handleToggleFullscreen}
          >
            <FullscreenIcon fontSize="large"></FullscreenIcon>
          </IconButton>
        </Grid>
      </Grid>
    </div>
  );
};

export default RTCPlayerControls;
