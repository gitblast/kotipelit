import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Fab, TextField, Typography, Grid } from '@material-ui/core';
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
  })
);

const RTCPlayerControls: React.FC = () => {
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
      !playerSelf.answers ||
      playerSelf.hasTurn
    ) {
      return true;
    }

    if (!playerSelf.answers[game.info.turn]) {
      return false;
    }

    const answer = playerSelf.answers[game.info.turn][game.info.round];

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
        <Grid item sm={1}></Grid>
        <Grid className={classes.controls} item sm={3}>
          <InfoBar />
        </Grid>
        <Grid className={classes.controls} item sm={4}>
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
        <Grid item sm={4}></Grid>
      </Grid>
    </div>
  );
};

export default RTCPlayerControls;
