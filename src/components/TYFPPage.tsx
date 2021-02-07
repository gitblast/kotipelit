import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { State } from '../types';
import { Redirect } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(3),
    },
  })
);

const TYFPPage: React.FC = () => {
  const classes = useStyles();

  const game = useSelector((state: State) => state.rtc.game);

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
    <Paper className={classes.container}>
      <Typography>Peli on päättynyt. Kiitos osallistumisesta!</Typography>
      {showPoints()}
    </Paper>
  );
};

export default TYFPPage;
