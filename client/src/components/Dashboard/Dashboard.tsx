import { Button, Typography } from '@material-ui/core';
// import Rating from '@material-ui/lab/Rating';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useGames } from '../../context';
import { GameStatus, LoggedInUser } from '../../types';
import GameCard from '../GameCard/GameCard';
import useDashboardSocket from './useDashboardSocket';
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

interface DashboardProps {
  user: LoggedInUser;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const classes = useStyles();
  const { t } = useTranslation();

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
            {t('dashboard.newgameButton')}
          </Button>
        </div>
      </div>
      <div className={classes.headline}>
        <div className={classes.neonLight}></div>
        <Typography variant="h4">
          {t('dashboard.upcomingGamesLabel')}
        </Typography>
      </div>
      {filterGamesByStatus('', GameStatus.RUNNING)}
      {filterGamesByStatus('', GameStatus.WAITING)}
      {filterGamesByStatus('', GameStatus.UPCOMING)}
      <div className={classes.headline}>
        <div className={classes.neonLight}></div>
        <Typography variant="h4">{t('dashboard.pastGamesLabel')}</Typography>
      </div>
      {filterGamesByStatus('', GameStatus.FINISHED)}
    </div>
  );
};

export default Dashboard;
