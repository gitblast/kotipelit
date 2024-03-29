import { Fab, Grid, IconButton, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import UndoIcon from '@material-ui/icons/Undo';
import React from 'react';
import useKotitonniHostControls from '../hooks/useKotitonniHostControls';
import { GameStatus } from '../types';
import InfoBar from './InfoBar';
import MainKotitonniButton from './MainKotitonniButton';
import SpectatorCount from './SpectatorCount';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import NetworkQualityLevel from './NetworkQualityLevel/NetworkQualityLevel';
import { LocalParticipant, RemoteParticipant } from 'twilio-video';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    controlsItem: {
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      marginBottom: theme.spacing(1.5),
      [theme.breakpoints.down('sm')]: {
        justifyContent: 'center',
      },
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
      justifyContent: 'center',
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

interface RTCHostControlsProps {
  handleToggleFullscreen: () => void;
  spectatorCount: number;
  participant: LocalParticipant | RemoteParticipant | null;
}

const RTCHostControls = ({
  handleToggleFullscreen,
  spectatorCount,
  participant,
}: RTCHostControlsProps) => {
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
    atHistory,
  } = useKotitonniHostControls();
  const classes = useStyles();
  const isWideEnough = useMediaQuery('(min-width:960px)');

  if (!game) {
    return null;
  }

  const mainBtnDisabled = () => {
    if (game.status !== GameStatus.RUNNING) {
      return false;
    }

    if (atHistory) {
      return false;
    }

    if (everyoneHasAnswered) {
      return false;
    }

    return timerValue !== 0;
  };

  return (
    <Grid container className={classes.controlsContent}>
      <Grid item sm={12} className={classes.controlsItem}>
        {game.status === GameStatus.RUNNING && !isWideEnough && <InfoBar />}
      </Grid>
      <Grid item md={4} className={classes.controlsItem}>
        {game.status === GameStatus.RUNNING && isWideEnough && <InfoBar />}
      </Grid>
      <Grid item md={4} sm={12} className={classes.controlsItem}>
        {game.status === GameStatus.RUNNING && (
          <Fab
            size="large"
            color={timerIsRunning ? 'primary' : 'secondary'}
            disabled={atHistory || timerValue === 0 || everyoneHasAnswered}
            onClick={() => {
              toggleTimer();
              fetchLatestGameStatus();
            }}
            className={classes.timerButton}
          >
            {timerIsRunning ? <PauseIcon /> : <PlayArrowIcon />}
            <Typography variant="h5">{timerValue}</Typography>
          </Fab>
        )}
        <MainKotitonniButton
          gameStatus={game.status}
          disabled={mainBtnDisabled()}
          handleStart={handleStart}
          handleFinish={handleFinish}
          handlePointUpdate={() => handlePointUpdate(game)}
        />
        {game.status === GameStatus.RUNNING && (
          <Fab
            size="medium"
            color="secondary"
            onClick={returnToPrevious}
            disabled={noHistorySet || timerValue !== 60}
            className={classes.returnPoints}
          >
            <UndoIcon className={classes.undoArrow} />
          </Fab>
        )}
      </Grid>
      <Grid item md={4} className={classes.controlsIcons}>
        {isWideEnough && game.allowedSpectators !== 0 && (
          <SpectatorCount count={spectatorCount} />
        )}

        <IconButton
          className={classes.controlBarIcons}
          onClick={handleToggleFullscreen}
        >
          <FullscreenIcon fontSize="large"></FullscreenIcon>
        </IconButton>
        <NetworkQualityLevel participant={participant} />
      </Grid>
    </Grid>
  );
};

export default RTCHostControls;
