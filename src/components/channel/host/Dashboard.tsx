import React from 'react';

import { Link } from 'react-router-dom';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Fab, Typography } from '@material-ui/core';

import QueuedGame from './QueuedGame';

import { State } from '../../../types';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    marginTop: { marginTop: theme.spacing(2) },
  })
);

// interface DashboardProps {}

const Dashboard: React.FC = () => {
  const classes = useStyles();

  const games = useSelector((state: State) => state.games);

  /** @TODO fetch username for link from logged user */
  return (
    <div>
      <div>
        <Typography variant="overline">Tulevat pelit:</Typography>
      </div>
      <div>
        {games && games.map((game) => <QueuedGame key={game.id} game={game} />)}
      </div>
      <div className={classes.marginTop}>
        <Fab
          color="primary"
          variant="extended"
          component={Link}
          to="/matleena/newgame"
        >
          LUO PELI
        </Fab>
      </div>
    </div>
  );
};

export default Dashboard;
