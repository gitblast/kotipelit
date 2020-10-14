import React from 'react';

import useInterval from '../hooks/useInterval';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Fab, Paper } from '@material-ui/core';

import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import UndoIcon from '@material-ui/icons/Undo';
import { RTCGame } from '../types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      backgroundColor: 'black',
    },
    btnContainer: {
      margin: theme.spacing(1),
    },
    timerContainer: {
      textAlign: 'center',
      width: 30,
    },
  })
);

interface RTCHostControlsProps {
  handleUpdate: (game: RTCGame) => void;
  game: RTCGame;
}

const RTCHostControls: React.FC<RTCHostControlsProps> = ({
  handleUpdate,
  game,
}) => {
  const classes = useStyles();

  const [timerRunning, setTimerRunning] = React.useState<boolean>(false);
  const [timer, setTimer] = React.useState<number>(90);

  React.useEffect(() => {
    if (timer === 0) {
      handleUpdate({
        ...game,
        info: {
          ...game.info,
          answeringOpen: false,
        },
      });
    }
  }, [timer]);

  useInterval(
    () => {
      setTimer(timer - 1);

      if (timer === 1) {
        setTimerRunning(false);
      }
    },
    timerRunning ? 1000 : null
  );

  const toggleTimer = () => {
    if (timer === 90) {
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

  return (
    <Paper elevation={3} className={classes.container} square>
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
          onClick={() => null}
          disabled={!game.info.answeringOpen}
        >
          Päivitä pisteet
        </Fab>
      </div>
      <div className={classes.btnContainer}>
        <Fab size="medium" color="secondary">
          <UndoIcon />
        </Fab>
      </div>
    </Paper>
  );
};

export default RTCHostControls;
