import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import MicOffIcon from '@material-ui/icons/MicOff';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { GamePlayer, GameType } from '../types';
import { Paper, Typography, IconButton } from '@material-ui/core';

import logger from '../utils/logger';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    badge: {
      margin: theme.spacing(1),
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      backgroundColor: 'darkgrey',
      color: 'white',
      opacity: 0.95,
      minWidth: 30,
    },
    hostBadge: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      margin: theme.spacing(1),
      backgroundColor: 'red',
      color: 'white',
      opacity: 0.95,
    },
    flexCol: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    flex: {
      display: 'flex',
    },
    spacer: {
      flex: '1 1 auto',
    },
  })
);

interface PlayerOverlayItemsProps {
  player: GamePlayer;
  gameType: GameType;
}

const PlayerOverlayItems: React.FC<PlayerOverlayItemsProps> = ({
  player,
  gameType,
}) => {
  const classes = useStyles();

  // handle different game types here
  if (gameType === GameType.KOTITONNI) {
    return (
      <div className={classes.flexCol}>
        <div className={classes.flex}>
          <div className={classes.spacer} />
          <Paper className={classes.badge}>
            <Typography>{player.points}</Typography>
          </Paper>
        </div>
        <div className={classes.flex}>
          <Paper className={classes.badge}>
            <Typography>{player.name}</Typography>
          </Paper>
          <div className={classes.spacer} />
          <IconButton size="small">
            <MicOffIcon />
          </IconButton>
          <IconButton size="small">
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
    );
  }

  logger.error('unknown game type');

  return null;
};

export default PlayerOverlayItems;
