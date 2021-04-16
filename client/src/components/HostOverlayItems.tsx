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
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      width: '100%',
      justifyContent: 'space-around',
      padding: theme.spacing(1),
      borderTop: 'dotted 3px rgb(0 225 217)',
      clipPath: 'polygon(10% 0, 90% 0, 91% 4%, 100% 100%, 0 100%, 8% 5%)',
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(0.5),
      },
    },
    hostName: {
      fontFamily: 'chicagoNeon',
      color: theme.palette.info.main,
      fontSize: '2.1rem',
      [theme.breakpoints.down('sm')]: {
        fontSize: '1.1rem',
      },
      [theme.breakpoints.down('xs')]: {
        fontSize: theme.spacing(4),
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
            <Typography variant="h3" className={classes.hostName}>
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
