import { Button, Typography } from '@material-ui/core';
// import Rating from '@material-ui/lab/Rating';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import { Link } from 'react-router-dom';
import { useGames } from '../context';
import { GameStatus, LoggedInUser, RTCGame } from '../types';
import GameCard from './GameCard/GameCard';
import { io as socketIOClient, Socket } from 'socket.io-client';

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

const useDashboardSocket = (
  authToken: string,
  setGames: React.Dispatch<React.SetStateAction<RTCGame[]>>
) => {
  const [socket, setSocket] = React.useState<null | Socket>();

  React.useEffect(() => {
    if (!socket) {
      const path =
        // eslint-disable-next-line no-undef
        process?.env.NODE_ENV === 'development'
          ? 'http://localhost:3333/dash'
          : '/dash';

      const client = socketIOClient(path, {
        autoConnect: false,
        transports: ['websocket'],
        upgrade: false,
        auth: {
          token: `Bearer ${authToken}`,
        },
      });

      client.on('game-has-updated', (updatedGame: RTCGame) => {
        setGames((currentGames: RTCGame[]) => {
          let updated = false;

          const updatedGames = currentGames.map((game) => {
            if (game.id === updatedGame.id) {
              updated = true;

              return updatedGame;
            }

            return game;
          });

          if (updated) {
            return updatedGames;
          }

          return currentGames.concat(updatedGame);
        });
      });

      client.connect();

      setSocket(client);
    }
  }, [authToken, socket, setGames]);
};

interface DashboardProps {
  user: LoggedInUser;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const classes = useStyles();

  const { games, initGames, setGames } = useGames();

  useDashboardSocket(user.token, setGames);

  React.useEffect(() => {
    initGames();
  }, [initGames]);

  const filterGamesByStatus = (label: string, status: GameStatus) => {
    const filtered = games.filter((game) => game.status === status);

    return filtered.length ? (
      <>
        <div>
          <Typography>{label}</Typography>
        </div>
        <div className={classes.games}>
          {filtered.map((game) => (
            <GameCard key={game.id} game={game} hostName={user.username} />
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
        <Typography variant="h4">Tulevat pelit</Typography>
      </div>
      {filterGamesByStatus('', GameStatus.RUNNING)}
      {filterGamesByStatus('', GameStatus.WAITING)}
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
