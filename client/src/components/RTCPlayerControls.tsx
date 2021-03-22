import { Grid, IconButton, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import React from 'react';
import useKotitonniPlayerControls from '../hooks/useKotitonniPlayerControls';

import AnswerForm from './AnswerForm';
import InfoBar from './InfoBar';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    controlsContent: {
      paddingTop: theme.spacing(0.5),
      paddingBottom: theme.spacing(3),
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1),
      },
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
    timer: {
      color: 'white',
      margin: theme.spacing(1),
      fontSize: 45,
    },
  })
);

const RTCPlayerControls: React.FC<{
  handleToggleFullscreen: () => void;
}> = ({ handleToggleFullscreen }) => {
  const classes = useStyles();
  const {
    handleAnswer,
    fetchLatestGameStatus,
    answeringDisabled,
    game,
    timerValue,
  } = useKotitonniPlayerControls();

  if (!game) {
    return null;
  }

  const handleAnswerWithInfo = (answer: string) => {
    handleAnswer(answer, game.info);
  };

  return (
    <div className={classes.container}>
      <Grid container className={classes.controlsContent}>
        <Grid item md={1}></Grid>
        <Grid item md={3} sm={3}>
          <InfoBar />
        </Grid>

        <Grid item md={4} sm={8}>
          <div className={classes.container}>
            <Typography className={classes.timer} variant="h6">
              {timerValue}
            </Typography>
            <AnswerForm
              handleAnswer={handleAnswerWithInfo}
              fetchLatestGameStatus={fetchLatestGameStatus}
              answeringDisabled={answeringDisabled}
            />
          </div>
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
