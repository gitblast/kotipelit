import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { Typography, Grid } from '@material-ui/core';

import MediaControls from './MediaControls';

import { GameType, RTCParticipant, State } from '../types';
import logger from '../utils/logger';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    // Repeated code from PlayerOverlay!
    nameBadge: {
      padding: theme.spacing(1),
      alignItems: 'center',
      // .. except for this
      backgroundColor: 'rgba(27, 55, 76, 0.85)',
      color: 'white',
      width: '100%',
      // .. except for this

      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(0.5),
      },
    },
    hostName: {
      fontSize: 28,
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

  const gameType = useSelector((state: State) => state.rtc.game?.type);

  if (!gameType) {
    return null;
  }

  // handle different game types here, "if gameType === kotitonni return kotitonni-items" etc
  if (gameType === GameType.KOTITONNI) {
    return (
      <div className={classes.flexCol}>
        <div className={classes.flex}>
          <div className={classes.spacer} />
        </div>
        <div className={classes.spacer} />
        <div className={classes.flex}>
          <Grid container className={classes.nameBadge}>
            <Grid item md={9} sm={8}>
              <Typography variant="subtitle2" className={classes.hostName}>
                {`Hosted by ${host.displayName}`}
              </Typography>
            </Grid>
            <Grid item md={3} sm={4}>
              <MediaControls participant={host} />
            </Grid>
            <div className={classes.spacer} />
          </Grid>
        </div>
      </div>
    );
  }

  logger.error('unknown game type');

  return null;
};

export default HostOverlayItems;
