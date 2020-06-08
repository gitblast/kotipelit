import React from 'react';

import { capitalize } from 'lodash';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Button, Typography, Paper } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: theme.spacing(1),
      marginTop: theme.spacing(1),
      alignItems: 'center',
    },
  })
);

interface TempGame {
  startTime: Date;
  players: number;
  type: string;
}

interface QueuedGameProps {
  game: TempGame;
}

const QueuedGame: React.FC<QueuedGameProps> = ({ game }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.container}>
      <div>
        <Typography>{game.startTime.toUTCString()}</Typography>
      </div>
      <div>
        <Typography>{capitalize(game.type)}</Typography>
      </div>
      <div>
        <Typography>{`${game.players} pelaajaa`}</Typography>
      </div>

      <div>
        <Button variant="contained" color="secondary">
          Käynnistä
        </Button>
      </div>
    </Paper>
  );
};

export default QueuedGame;
