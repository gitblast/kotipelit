import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { Paper, Typography, IconButton } from '@material-ui/core';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { setMuted } from '../reducers/kotitonni.local.reducer';
import { GameType, RTCPeer, State } from '../types';
import logger from '../utils/logger';
import { useSelector, useDispatch } from 'react-redux';

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
          <Paper className={classes.hostBadge}>
            <Typography>HOST</Typography>
          </Paper>
        </div>
        <div className={classes.spacer} />
        <div className={classes.flex}>
          <Paper className={classes.badge}>
            <Typography>{host.displayName}</Typography>
          </Paper>
          <div className={classes.spacer} />
          <IconButton size="small" onClick={toggleMuted}>
            {mutedMap[host.id] ? <MicOffIcon color="error" /> : <MicIcon />}
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
