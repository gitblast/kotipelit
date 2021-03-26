import React from 'react';
import { Link, useLocation, Redirect } from 'react-router-dom';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Typography, Paper, Button } from '@material-ui/core';
import logger from '../utils/logger';
import { RTCGame } from '../../../server/src/types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      margin: theme.spacing(2),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    resultsPaper: {
      padding: theme.spacing(2),
      minWidth: 350,
      color: theme.palette.primary.light,
      margin: theme.spacing(3),
      textAlign: 'center',

      '& > * + *': {
        margin: theme.spacing(1),
      },
    },
    results: {
      padding: theme.spacing(1.5),
      textAlign: 'center',
    },
  })
);

interface LocationState {
  game: RTCGame | undefined;
}

const TYFPPage: React.FC = () => {
  const classes = useStyles();

  const location = useLocation<LocationState | undefined>();

  const game = location.state?.game;

  React.useEffect(() => {
    if (game) {
      logger.log('removing reservation data from local storage');
      window.localStorage.removeItem(`kotitonniReservation-gameID-${game.id}`);
    }
  }, [game]);

  if (!game) {
    logger.error('no game was set');

    return <Redirect to="/" />;
  }

  const showPoints = () => {
    const sortedByPoints = game.players
      .concat()
      .sort((a, b) => b.points - a.points);

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
      <Paper elevation={3} className={classes.resultsPaper}>
        <Typography variant="h5">Peli on päättynyt!</Typography>
        <div className={classes.results}>{showPoints()}</div>
      </Paper>
      <Button color="secondary" component={Link} to="/kirjaudu">
        Järjestä kotipelit
      </Button>
    </div>
  );
};

export default TYFPPage;
