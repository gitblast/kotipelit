import React from 'react';

import { Link } from 'react-router-dom';
// import Rating from '@material-ui/lab/Rating';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Button, Typography } from '@material-ui/core';

import QueuedGame from './QueuedGame';

import { State, LoggedUser, GameStatus } from '../../types';
import { useSelector, useDispatch } from 'react-redux';

import { initGames } from '../../reducers/games.reducer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      margin: 'auto',
      padding: theme.spacing(3),
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(0.5),
      },
    },
    userSection: {
      display: 'flex',
      justifyContent: 'start',
      alignItems: 'center',
      flexWrap: 'wrap',
      '& > * + *': {
        margin: theme.spacing(3),
      },
      [theme.breakpoints.down('xs')]: {
        justifyContent: 'center',
      },
    },
    headline: {
      display: 'flex',
      justifyContent: 'flex-start',
      marginTop: theme.spacing(4),
    },
    neonLight: {
      height: 3,
      background:
        'linear-gradient(to right, rgb(0 225 217), rgba(11, 43, 56, 1))',
      boxShadow: 'rgb(231 239 191) -23px 8px 44px',
      width: '11vw',
      alignSelf: 'center',
      marginTop: '6px',
    },
    newGameButton: {
      border: 'solid',
      boxShadow: '#608478 1px 3px 12px 2px',
    },
    games: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    avatar: {
      backgroundColor: '#3d0833',
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
  })
);

interface DashboardProps {
  user: LoggedUser;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const classes = useStyles();

  const dispatch = useDispatch();

  React.useEffect(() => {
    // todo: handle changes in socket.io callbacks to not fetch all games every time dashboard renders
    dispatch(initGames());
  }, [dispatch]);

  const games = useSelector((state: State) => state.games.allGames);

  const filterGamesByStatus = (label: string, status: GameStatus) => {
    const filtered = games.filter((game) => game.status === status);

    return filtered.length ? (
      <>
        <div>
          <Typography>{label}</Typography>
        </div>
        <div className={classes.games}>
          {filtered.map((game) => (
            <QueuedGame key={game.id} game={game} username={user.username} />
          ))}
        </div>
      </>
    ) : null;
  };

  return (
    <div className={classes.container}>
      <div className={classes.userSection}>
        <div>
          <Button
            className={classes.newGameButton}
            color="secondary"
            component={Link}
            to={`/${user.username}/newgame`}
          >
            Uusi peli
          </Button>
        </div>
      </div>
      <div className={classes.headline}>
        <div className={classes.neonLight}></div>
        <Typography variant="h4">Käynnissä olevat pelit</Typography>
      </div>
      {filterGamesByStatus('', GameStatus.RUNNING)}
      <div className={classes.headline}>
        <div className={classes.neonLight}></div>
        <Typography variant="h4">Odottaa pelaajia</Typography>
      </div>
      {filterGamesByStatus('', GameStatus.WAITING)}
      <div className={classes.headline}>
        <div className={classes.neonLight}></div>
        <Typography variant="h4">Tulevat pelit</Typography>
      </div>
      {filterGamesByStatus('', GameStatus.UPCOMING)}
      <div className={classes.headline}>
        <div className={classes.neonLight}></div>
        <Typography variant="h4">Menneet pelit</Typography>
      </div>
      {filterGamesByStatus('', GameStatus.FINISHED)}
    </div>
  );
};

export default Dashboard;
