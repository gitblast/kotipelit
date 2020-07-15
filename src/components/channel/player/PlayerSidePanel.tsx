import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { SanakiertoPlayer } from '../../../types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({ container: { padding: theme.spacing(1) } })
);

interface PlayerSidePanelProps {
  players: SanakiertoPlayer[];
}

const PlayerSidePanel: React.FC<PlayerSidePanelProps> = ({ players }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {players.map((player) => (
        <div key={player.id}>
          {player.name} {player.online ? '(online)' : ''}{' '}
          {`Points: ${player.points}`}
        </div>
      ))}
    </div>
  );
};

export default PlayerSidePanel;
