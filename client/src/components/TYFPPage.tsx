import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Typography, Paper } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../types';
import { Redirect } from 'react-router-dom';
import logger from '../utils/logger';
import { setGame } from '../reducers/rtcGameSlice';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      margin: theme.spacing(2),
      display: 'flex',
      justifyContent: 'center',
    },
    loginField: {
      padding: theme.spacing(2),
      maxWidth: 350,
      color: theme.palette.primary.light,
      textAlign: 'center',
      '& > * + *': {
        margin: theme.spacing(1),
      },
    },
    results: {
      padding: theme.spacing(1.5),
      textAlign: 'center',
    },
    proposal: {
      paddingTop: theme.spacing(1.5),
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
      },
    },
  })
);

const TYFPPage: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const game = useSelector((state: State) => state.rtc.game);

  React.useEffect(() => {
    if (game) {
      logger.log('removing reservation data from local storage');
      window.localStorage.removeItem(`kotitonniReservation-gameID-${game.id}`);

      return () => {
        logger.log('setting game to null');

        dispatch(setGame(null));
      };
    }
  }, [game]);

  if (!game) {
    return <Redirect to="/" />;
  }

  const showPoints = () => {
    const sortedByPoints = game.players.sort((a, b) => b.points - a.points);

    return sortedByPoints.map((player) => {
      return (
        <Typography key={player.id} component="div">
          {player.name} : {player.points}
        </Typography>
      );
    });
  };

  return (
    <div className={classes.container}>
      <Paper elevation={3} className={classes.loginField}>
        <Typography variant="h5">Kiitos osallistumisesta!</Typography>
        <div className={classes.results}>{showPoints()}</div>
        <Typography className={classes.proposal}>
          Jos haluat haastaa kaverisi, perheesi tai kollegasi Kotitonnissa ota
          yhteyttä info [at] kotipelit.com.
        </Typography>
      </Paper>
    </div>
  );
};

export default TYFPPage;
