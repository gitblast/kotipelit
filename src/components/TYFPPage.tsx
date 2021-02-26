import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { State } from '../types';
import { Redirect } from 'react-router-dom';
import logger from '../utils/logger';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(3),
      textAlign: 'center',
      color: 'rgb(0 225 217)',
    },
    results: {
      padding: theme.spacing(5),
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
      },
    },
    proposal: {
      padding: theme.spacing(5),
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
      },
    },
  })
);

const TYFPPage: React.FC = () => {
  const classes = useStyles();

  const game = useSelector((state: State) => state.rtc.game);

  React.useEffect(() => {
    if (game) {
      logger.log('removing reservation data from local storage');
      window.localStorage.removeItem(`kotitonniReservation-gameID-${game.id}`);
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
      <Typography>Kiitos osallistumisesta!</Typography>
      <div className={classes.results}>{showPoints()}</div>
      <Typography className={classes.proposal}>
        Jos haluat alkaa järjestämään peli-iltoja tai vain haastaa kaverisi,
        perheesi tai kollegasi Kotitonnissa ota yhteyttä info [at]
        kotipelit.com.
      </Typography>
    </div>
  );
};

export default TYFPPage;
