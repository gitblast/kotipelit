import React from 'react';

import { Link } from 'react-router-dom';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Fab, Typography } from '@material-ui/core';

import QueuedGame from './QueuedGame';

import { State, LoggedUser } from '../../../types';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    marginTop: { marginTop: theme.spacing(2) },
  })
);

interface DashboardProps {
  user: LoggedUser;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const classes = useStyles();

  const games = useSelector((state: State) => state.games.allGames);

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
          to={`/${user.username}/newgame`}
        >
          LUO PELI
        </Fab>
      </div>
    </div>
  );
};

export default Dashboard;
