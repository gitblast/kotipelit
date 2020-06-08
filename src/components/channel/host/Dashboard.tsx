import React from 'react';

import { Link } from 'react-router-dom';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Fab, Typography } from '@material-ui/core';

import QueuedGame from './QueuedGame';

import { SelectableGame, GameType } from '../../../types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: { marginTop: theme.spacing(2) },
  })
);

const hardcodedGames = [
  {
    id: '1',
    type: 'sanakierto' as GameType,
    players: [
      {
        name: 'Risto',
        words: ['jojo', 'kasvi', 'hattu'],
      },
      {
        name: 'Jorma',
        words: ['sana', 'kirja', 'väline'],
      },
      {
        name: 'Kalevi',
        words: ['kaiutin', 'kuuloke', 'lasi'],
      },
      {
        name: 'Jenni',
        words: ['johto', 'hiiri', 'puhelin'],
      },
      {
        name: 'Petra',
        words: ['rasia', 'kuppi', 'vihko'],
      },
    ],
    startTime: new Date(),
  },
  {
    id: '2',
    type: 'sanakierto' as GameType,
    players: [
      {
        name: 'Matti',
        words: ['lamppu', 'pöytä', 'sohva'],
      },
      {
        name: 'Pertti',
        words: ['laulu', 'tuoli', 'peitto'],
      },
      {
        name: 'Lauri',
        words: ['naru', 'ikkuna', 'ovi'],
      },
      {
        name: 'Abraham',
        words: ['presidentti', 'päällikkö', 'lattia'],
      },
      {
        name: 'Sauli',
        words: ['sammakko', 'tikku', 'lanka'],
      },
    ],
    startTime: new Date(),
  },
];

// interface DashboardProps {}

const Dashboard: React.FC = () => {
  const classes = useStyles();

  // scheduled games
  const [upcomingGames, setUpcomingGames] = React.useState<
    null | SelectableGame[]
  >(hardcodedGames);

  /** @TODO fetch username for link from logged user */
  return (
    <div className={classes.container}>
      <div>
        <Typography variant="overline">Tulevat pelit:</Typography>
      </div>
      <div>
        {upcomingGames &&
          upcomingGames.map((game) => <QueuedGame key={game.id} game={game} />)}
      </div>
      <div className={classes.container}>
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
