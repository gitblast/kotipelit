import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';

import HostPanel from './HostPanel';
import { useSelector } from 'react-redux';
import { State, GameStatus, GameType } from '../../../../types';

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
    console.error('No active game found, using hard coded');

  const HARDCODED = {
    id: '1',
    type: 'sanakierto' as GameType,
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

  return (
    <div className={classes.container}>
      <Paper elevation={5} className={classes.jitsiContainer}>
        <Typography>Jitsi</Typography>
      </Paper>
      <Paper elevation={5} className={classes.hostControls}>
        <HostPanel game={activeGame ? activeGame : HARDCODED} />
      </Paper>
    </div>
  );
};

export default Sanakierto;
