import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';

import HostPanel from './HostPanel';
import Results from './Results';

import { useSelector } from 'react-redux';
import {
  State,
  GameStatus,
  GameType,
  SanakiertoPlayer,
} from '../../../../types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
    },
    jitsiContainer: {
      width: '65%',
      padding: theme.spacing(2),
      backgroundColor: theme.palette.grey[400],
    },
    hostControls: {
      width: '35%',
      padding: theme.spacing(2),
      marginLeft: theme.spacing(1),
    },
  })
);

// interface SanakiertoProps {}

const Sanakierto: React.FC = () => {
  const classes = useStyles();
  const activeGame = useSelector((state: State) => state.activeGame);

  if (activeGame === null)
    console.error('No active game found, using hard coded (dev)');

  const HARDCODED = {
    id: '1',
    type: GameType.SANAKIERTO,
    players: [
      {
        id: '1',
        name: 'Risto',
        words: ['jojo', 'kasvi', 'hattu'],
        points: 0,
      },
      {
        id: '2',
        name: 'Jorma',
        words: ['sana', 'kirja', 'väline'],
        points: 0,
      },
      {
        id: '3',
        name: 'Kalevi',
        words: ['kaiutin', 'kuuloke', 'lasi'],
        points: 0,
      },
      {
        id: '4',
        name: 'Jenni',
        words: ['johto', 'hiiri', 'puhelin'],
        points: 0,
      },
      {
        id: '5',
        name: 'Petra',
        words: ['rasia', 'kuppi', 'vihko'],
        points: 0,
      },
    ],
    startTime: new Date(),
    status: GameStatus.UPCOMING,
    rounds: 3,
    winner: null,
    round: 1,
    turn: 0,
  };

  const sortPlayersByPoints = (players: SanakiertoPlayer[]) => {
    return players.sort((a, b) => b.points - a.points);
  };

  return (
    <div className={classes.container}>
      <Paper elevation={5} className={classes.jitsiContainer}>
        <Typography>Jitsi</Typography>
      </Paper>
      <Paper elevation={5} className={classes.hostControls}>
        {activeGame && activeGame.status === GameStatus.FINISHED ? (
          <Results results={sortPlayersByPoints(activeGame.players)} />
        ) : (
          <HostPanel game={activeGame ? activeGame : HARDCODED} />
        )}
      </Paper>
    </div>
  );
};

export default Sanakierto;
