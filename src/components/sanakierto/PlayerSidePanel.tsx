import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { SanakiertoActive } from '../../types';
import { Typography } from '@material-ui/core';

import Scores from './Scores';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({ container: { padding: theme.spacing(2) } })
);

interface PlayerSidePanelProps {
  game: SanakiertoActive;
}

const PlayerSidePanel: React.FC<PlayerSidePanelProps> = ({ game }) => {
  const classes = useStyles();

  const { players, info } = game;

  const playerInTurnIndex = players.findIndex(
    (player) => player.id === info.turn
  );

  if (playerInTurnIndex < 0)
    throw new Error('Something went wrong with player turns');

  const playerWithTurn = players[playerInTurnIndex];

  return (
    <div>
      <div className={classes.container}>
        <Typography variant="h6">{`Kierros ${game.info.round}`}</Typography>
        <Typography variant="overline" component="div">
          Vuorossa:
        </Typography>
        <Typography component="div" gutterBottom>
          {playerWithTurn.name}
        </Typography>
      </div>
      <Scores players={game.players} />
    </div>
  );
};

export default PlayerSidePanel;
