import React from 'react';

import useInterval from '../hooks/useInterval';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Fab, Paper } from '@material-ui/core';

import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import UndoIcon from '@material-ui/icons/Undo';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import { RTCGame } from '../types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      backgroundColor: 'rgba(34, 34, 59)',
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
    },
    timerBtn: {
      backgroundColor: 'rgba(244, 172, 69)',
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
          className={classes.timerBtn}
        >
          {timerRunning ? <PauseIcon /> : <PlayArrowIcon />}
          <div className={classes.timerContainer}>{timer}</div>
        </Fab>
      </div>
      <div className={classes.btnContainer}>
        <Fab
          variant="extended"
          onClick={() => null}
          disabled={!game.info.answeringOpen}
          className={classes.updatePoints}
        >
          Päivitä pisteet
        </Fab>
      </div>
      <div className={classes.btnContainer}>
        <Fab size="medium" className={classes.returnPoints}>
          <UndoIcon />
        </Fab>
      </div>
      <div className={classes.fullScreen}>
        <FullscreenIcon />
      </div>
    </Paper>
  );
};

export default RTCHostControls;
