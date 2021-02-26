import React from 'react';

import { Link } from 'react-router-dom';
// import Rating from '@material-ui/lab/Rating';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Fab, Typography } from '@material-ui/core';

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
    hostInfo: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      padding: theme.spacing(2),
      background: 'rgba(52, 75, 115, 0.7)',
      color: 'white',
      width: 300,
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
      },
    },
    userBadge: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      '& > * + *': {
        margin: theme.spacing(1),
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
    userStats: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing(3),
    },
    stars: {
      textAlign: 'center',
      padding: theme.spacing(2),
    },
    newGame: {
      padding: theme.spacing(4),
      border: 'solid',
      boxShadow: '#608478 6px 12px 18px 1px',
      marginBottom: theme.spacing(2),
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

// const RatingStars = () => {
//   const classes = useStyles();
//   return (
//     <div className={classes.stars}>
//       <Rating
//         name="rating-read"
//         size="large"
//         defaultValue={4.5}
//         precision={0.5}
//         readOnly
//       />
//     </div>
//   );
// };

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
          <Typography variant="h5">{label}</Typography>
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
        {/* <Paper className={classes.hostInfo}>
          <div className={classes.userBadge}>
            <Avatar aria-label="User" className={classes.avatar}>
              K
            </Avatar>
            <Typography>{user.username}</Typography>
          </div>
          <RatingStars />
          <div className={classes.userStats}>
            <Typography>Peli-iltoja: 0</Typography>

            <Typography>Pelituotot: 0€</Typography>
          </div>
        </Paper> */}
        <div>
          <Fab
            className={classes.newGame}
            color="secondary"
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
