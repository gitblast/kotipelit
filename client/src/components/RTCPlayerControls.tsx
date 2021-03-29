import { Grid, IconButton, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import React from 'react';
import useKotitonniPlayerControls from '../hooks/useKotitonniPlayerControls';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import AnswerForm from './AnswerForm';
import InfoBar from './InfoBar';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    controlsContent: {
      alignItems: 'center',
      paddingTop: theme.spacing(0.5),
      paddingBottom: theme.spacing(3),
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1),
      },
      [theme.breakpoints.down('sm')]: {
        justifyContent: 'center',
      },
    },
    controlsItem: {
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      [theme.breakpoints.down('sm')]: {
        justifyContent: 'center',
      },
    },
    controlsIcons: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      [theme.breakpoints.down('sm')]: {
        display: 'none',
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
      [theme.breakpoints.down('xs')]: {
        textAlign: 'center',
      },
    },
  })
);

const RTCPlayerControls: React.FC<{
  handleToggleFullscreen: () => void;
}> = ({ handleToggleFullscreen }) => {
  const classes = useStyles();
  const isWideEnough = useMediaQuery('(min-width:550px)');
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
    <Grid container className={classes.controlsContent}>
      <Grid item md={4} sm={12} xs={12} className={classes.controlsItem}>
        <InfoBar />
      </Grid>

      {!isWideEnough && (
        <Grid item xs={12}>
          <Typography className={classes.timer} variant="body1">
            {timerValue}
          </Typography>
        </Grid>
      )}

      <Grid item md={4} sm={12} className={classes.controlsItem}>
        {isWideEnough && (
          <Typography className={classes.timer} variant="h5">
            {timerValue}
          </Typography>
        )}

        <AnswerForm
          handleAnswer={handleAnswerWithInfo}
          fetchLatestGameStatus={fetchLatestGameStatus}
          answeringDisabled={answeringDisabled}
        />
      </Grid>
      <Grid item md={4} sm={3} className={classes.controlsIcons}>
        <IconButton className={classes.fsIcon} onClick={handleToggleFullscreen}>
          <FullscreenIcon fontSize="large"></FullscreenIcon>
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default RTCPlayerControls;
