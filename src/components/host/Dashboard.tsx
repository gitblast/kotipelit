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
      margin: 'auto',
      padding: theme.spacing(3),
    },
    hostInfo: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      textAlign: 'center',
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      padding: theme.spacing(2),
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
      },
    },
    newGame: {
      padding: theme.spacing(4),
    },
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
          <Typography variant="h5">{label}</Typography>
        </div>
        {filtered.map((game) => (
          <QueuedGame key={game.id} game={game} username={user.username} />
        ))}
      </>
    ) : null;
  };

  return (
    <div className={classes.container}>
      <div className={classes.hostInfo}>
        <div>
          <Typography variant="h5">Peli-iltoja</Typography>
          <Typography variant="h3">0</Typography>
        </div>
        <div>
          <Typography variant="h5">Pelituotot</Typography>
          <Typography variant="h3">0€</Typography>
        </div>
        <div>
          <Typography variant="h5">Rating</Typography>
          <Typography variant="h3">5/5</Typography>
        </div>
        <div>
          <Fab
            className={classes.newGame}
            color="primary"
            variant="extended"
            component={Link}
            to={`/${user.username}/newgame`}
          >
            <Typography variant="h6">Uusi peli</Typography>
          </Fab>
        </div>
      </div>
      {filterGamesByStatus('Käynnissä olevat pelit', GameStatus.RUNNING)}
      {filterGamesByStatus('Odottaa pelaajia', GameStatus.WAITING)}
      {filterGamesByStatus('Tulevat pelit', GameStatus.UPCOMING)}
      {filterGamesByStatus('Menneet pelit', GameStatus.FINISHED)}
    </div>
  );
};

export default Dashboard;
