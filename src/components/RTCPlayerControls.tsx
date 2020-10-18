import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Fab, Paper, TextField } from '@material-ui/core';
import { shallowEqual, useSelector } from 'react-redux';
import { State } from '../types';
import logger from '../utils/logger';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      width: '100%',
    },
    btnContainer: {
      margin: theme.spacing(1),
    },
  })
);

const RTCPlayerControls: React.FC = () => {
  const classes = useStyles();
  const [answer, setAnswer] = React.useState<string>('');

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
    <Paper elevation={3} className={classes.container} square>
      <div>
        <TextField
          variant="outlined"
          label="Vastaus"
          value={answer}
          onChange={({ target }) => setAnswer(target.value)}
          disabled={disabled}
        />
      </div>
      <div className={classes.btnContainer}>
        <Fab
          variant="extended"
          color="primary"
          onClick={handleClick}
          disabled={disabled}
        >
          Vastaa
        </Fab>
      </div>
    </Paper>
  );
};

export default RTCPlayerControls;
