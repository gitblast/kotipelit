import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { Typography, IconButton, Grid } from '@material-ui/core';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';

import { setMuted } from '../reducers/kotitonni.local.reducer';
import { GameType, RTCPeer, State } from '../types';
import logger from '../utils/logger';
import { useSelector, useDispatch } from 'react-redux';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    // Repeated code from PlayerOverlay!
    nameBadge: {
      padding: theme.spacing(2),
      backgroundColor: 'black',
      color: 'white',
      opacity: 0.8,
      width: '100%',
      // .. except for this
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1),
      },
    },
    hostName: {},
    // Repeated code from PlayerOverlay!
    controlIcon: {
      color: 'white',
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
}

const HostOverlayItems: React.FC<HostOverlayItemsProps> = ({ host }) => {
  const classes = useStyles();
  const mutedMap = useSelector((state: State) => state.rtc.localData.mutedMap);
  const gameType = useSelector((state: State) => state.rtc.game?.type);
  const dispatch = useDispatch();

  if (!gameType) {
    return null;
  }

  const toggleMuted = () => {
    if (host.isMe) {
      // toggle enable/disable audio track if self
      const audioTracks = host.stream?.getAudioTracks();

      if (audioTracks && audioTracks.length) {
        audioTracks[0].enabled = !audioTracks[0].enabled;
      }
    }

    dispatch(setMuted(host.id, !mutedMap[host.id]));
  };

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
            <Grid item md={1} sm={1}></Grid>
            <Grid item md={9} sm={9}>
              <Typography variant="h6">{host.displayName}</Typography>
            </Grid>
            <Grid item md={2} sm={2}>
              <IconButton
                className={classes.controlIcon}
                size="small"
                onClick={toggleMuted}
              >
                {mutedMap[host.id] ? <MicOffIcon color="error" /> : <MicIcon />}
              </IconButton>
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
