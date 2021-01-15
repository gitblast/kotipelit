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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      width: '100%',
      [theme.breakpoints.down('sm')]: {
        padding: 0,
      },
    },
    controls: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    btnContainer: {
      background: 'linear-gradient(to top, #c31432, #240b36)',
      color: 'white',
      padding: theme.spacing(4),
      margin: theme.spacing(1),
      border: 'solid',
      borderColor: 'white',
    },
    timer: {
      color: 'white',
      padding: theme.spacing(2),
      margin: theme.spacing(1),
      fontSize: 45,
    },
    answerField: {
      backgroundColor: 'white',
    },
    // Repeat from RTCHostControls
    controlBarIcons: {
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
      !playerSelf.data.answers ||
      playerSelf.hasTurn
    ) {
      return true;
    }

    if (!playerSelf.data.answers[game.info.turn]) {
      return false;
    }

    const answer = playerSelf.data.answers[game.info.turn][game.info.round];

    return !!answer;
  };

  const handleClick = () => {
    if (!self || !game) {
      logger.error('self object or game missing when trying to emit');

      return;
    }

    if (answer.length) {
      const answerObj = {
        answer,
        info: game.info,
      };

      self.socket.emit('answer', answerObj);

      setAnswer('');
    }
  };

  const disabled = isDisabled();

  return (
    <div className={classes.container}>
      <Grid container>
        <Grid item md={1}></Grid>
        <Grid className={classes.controls} item md={3} sm={3}>
          <InfoBar />
        </Grid>
        <Grid className={classes.controls} item md={4} sm={6}>
          <Typography className={classes.timer} variant="h6">
            {timer}
          </Typography>

          <div className={classes.answerField}>
            <TextField
              variant="filled"
              label="Vastaus.."
              value={answer}
              onChange={({ target }) => setAnswer(target.value)}
              disabled={disabled}
            />
          </div>

          <Fab
            className={classes.btnContainer}
            variant="extended"
            onClick={handleClick}
            disabled={disabled}
          >
            <Typography variant="h6">Vastaa</Typography>
          </Fab>
        </Grid>
        <Grid item md={2} sm={3}></Grid>
        <Grid item className={classes.controls} md={2}>
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

export default RTCPlayerControls;
