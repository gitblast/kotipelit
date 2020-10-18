import React from 'react';

import { Link } from 'react-router-dom';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Fab, Typography } from '@material-ui/core';

import QueuedGame from './QueuedGame';

import { State, LoggedUser, GameStatus } from '../../types';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: '90%',
      margin: 'auto',
    },
    marginTop: { marginTop: theme.spacing(2) },
  })
);

interface DashboardProps {
  user: LoggedUser;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const classes = useStyles();

  const games = useSelector((state: State) => state.games.allGames);

  const filterGamesByStatus = (label: string, status: GameStatus) => {
    const filtered = games.filter((game) => game.status === status);

    return filtered.length ? (
      <>
        <div>
          <Typography variant="overline">{label}</Typography>
        </div>
        <div>
          {filtered.map((game) => (
            <QueuedGame key={game.id} game={game} username={user.username} />
          ))}
        </div>
      </>
    ) : null;
  };

  return (
    <div className={classes.container}>
      {filterGamesByStatus('Käynnissä nyt', GameStatus.RUNNING)}
      {filterGamesByStatus('Odottaa pelaajia', GameStatus.WAITING)}
      {filterGamesByStatus('Tulevat pelit', GameStatus.UPCOMING)}
      {filterGamesByStatus('Menneet pelit', GameStatus.FINISHED)}
      <div className={classes.marginTop}>
        <Fab
          color="primary"
          variant="extended"
          component={Link}
          to={`/${user.username}/newgame`}
        >
          UUSI PELI
        </Fab>
      </div>
    </div>
  );
};

export default Dashboard;
