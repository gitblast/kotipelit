import { Fab, Grid, IconButton, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import UndoIcon from '@material-ui/icons/Undo';
// import TvIcon from '@material-ui/icons/Tv';
import React from 'react';
import useKotitonniHostControls from '../hooks/useKotitonniHostControls';
import { GameStatus } from '../types';
import InfoBar from './InfoBar';
import MainKotitonniButton from './MainKotitonniButton';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    controlsItem: {
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    controlsIcons: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
    controlsContent: {
      alignItems: 'center',
      paddingTop: theme.spacing(0.5),
      paddingBottom: theme.spacing(3),
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1),
      },
    },
    controlBarIcons: {
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
      padding: theme.spacing(4.5),
      border: 'solid',
      borderColor: 'white',
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(3),
      },
    },
    timerText: {
      [theme.breakpoints.down('sm')]: {
        fontSize: 22,
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
  })
);

const RTCHostControls: React.FC<{
  handleToggleFullscreen: () => void;
}> = ({ handleToggleFullscreen }) => {
  const {
    game,
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
  } = useKotitonniHostControls();
  const classes = useStyles();

  if (!game) {
    return null;
  }

  const answeringOpen = timerIsRunning
    ? !everyoneHasAnswered
    : timerValue !== 0 && timerValue !== 60;

  return (
    <Grid container className={classes.controlsContent}>
      <Grid item md={4} sm={3} className={classes.controlsItem}>
        {game.status === GameStatus.RUNNING && <InfoBar />}
      </Grid>
      <Grid item md={4} sm={6} xs={12} className={classes.controlsItem}>
        {game.status === GameStatus.RUNNING && (
          <Fab
            size="large"
            color={timerIsRunning ? 'primary' : 'secondary'}
            onClick={() => {
              toggleTimer();
              fetchLatestGameStatus();
            }}
            className={classes.timerButton}
          >
            {timerIsRunning ? <PauseIcon /> : <PlayArrowIcon />}
            <Typography variant="h6" className={classes.timerText}>
              {timerValue}
            </Typography>
          </Fab>
        )}
        <MainKotitonniButton
          gameStatus={game.status}
          disabled={GameStatus.RUNNING ? answeringOpen : false}
          handleStart={handleStart}
          handleFinish={handleFinish}
          handlePointUpdate={() => handlePointUpdate(game)}
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
      <Grid item md={4} sm={3} className={classes.controlsIcons}>
        {/* <IconButton>
          <TvIcon></TvIcon>
          <span>
            <Typography variant="body2" color="initial">
              22
            </Typography>
          </span>
        </IconButton> */}

        <IconButton
          className={classes.controlBarIcons}
          onClick={handleToggleFullscreen}
        >
          <FullscreenIcon fontSize="large"></FullscreenIcon>
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default RTCHostControls;
