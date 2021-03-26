import { Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import { useGameData } from '../context';
import { GameType, RTCParticipant } from '../types';
import logger from '../utils/logger';
import MediaControls from './MediaControls';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    // Repeated code from PlayerOverlay!
    nameBadge: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: theme.spacing(1),
      alignItems: 'center',
      // .. except for this
      backgroundColor: 'rgb(34 110 108)',
      color: 'white',
      width: '100%',
      // .. except for this

      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(0.5),
      },
    },
    hostName: {
      [theme.breakpoints.down('sm')]: {
        fontSize: 18,
      },
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
  host: RTCParticipant;
}

const HostOverlayItems: React.FC<HostOverlayItemsProps> = ({ host }) => {
  const classes = useStyles();

  const { game } = useGameData();

  // handle different game types here, "if gameType === kotitonni return kotitonni-items" etc
  if (game.type === GameType.KOTITONNI) {
    return (
      <div className={classes.flexCol}>
        <div className={classes.spacer} />
        <div className={classes.flex}>
          <div className={classes.nameBadge}>
            <Typography variant="h6" className={classes.hostName}>
              {host.displayName}
            </Typography>
            <div>
              <MediaControls participant={host} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  logger.error('unknown game type');

  return null;
};

export default HostOverlayItems;
