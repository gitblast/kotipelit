import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Fab, Typography } from '@material-ui/core';

import QueuedGame from './QueuedGame';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: { marginTop: theme.spacing(2) },
  })
);

// interface DashboardProps {}

const hardcodedGames = [
  {
    id: '1',
    type: 'sanakierto',
    players: 5,
    startTime: new Date(),
  },
  {
    id: '2',
    type: 'sanakierto',
    players: 5,
    startTime: new Date(),
  },
];

const Dashboard: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div>
        <Typography variant="overline">Tulevat pelit:</Typography>
      </div>
      <div>
        {hardcodedGames.map((game) => (
          <QueuedGame key={game.id} game={game} />
        ))}
      </div>
      <div className={classes.container}>
        <Fab color="primary" variant="extended">
          LUO PELI
        </Fab>
      </div>
    </div>
  );
};

export default Dashboard;
