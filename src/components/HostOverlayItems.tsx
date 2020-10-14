import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { Paper, Typography, IconButton } from '@material-ui/core';
import MicOffIcon from '@material-ui/icons/MicOff';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import { GameType, RTCPeer } from '../types';
import logger from '../utils/logger';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    badge: {
      margin: theme.spacing(1),
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      backgroundColor: 'black',
      color: 'white',
      opacity: 0.35,
      minWidth: 30,
    },
    hostBadge: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      margin: theme.spacing(1),
      opacity: 0.95,
    },
    flexCol: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    flex: {
      display: 'flex',
    },
    spacer: {
      flex: '1 1 auto',
    },
  })
);

interface HostOverlayItemsProps {
  host: RTCPeer;
  gameType: GameType;
}

const HostOverlayItems: React.FC<HostOverlayItemsProps> = ({
  host,
  gameType,
}) => {
  const classes = useStyles();
  // handle different game types here, "if gameType === kotitonni return kotitonni-items" etc
  if (gameType === GameType.KOTITONNI) {
    return (
      <div className={classes.flexCol}>
        <div className={classes.flex}>
          <div className={classes.spacer} />
          <AccountCircleIcon className={classes.hostBadge} />
        </div>
        <div className={classes.spacer} />
        <div className={classes.flex}>
          <Paper className={classes.badge}>
            <Typography>{host.displayName}</Typography>
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

export default HostOverlayItems;
