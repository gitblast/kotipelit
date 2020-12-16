import React from 'react';

import { useSelector } from 'react-redux';

import VideoWithOverlay from './VideoWithOverlay';
import PlayerOverlayItems from './PlayerOverlayItems';
import HostOverlayItems from './HostOverlayItems';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { GameStatus, RTCPeer, State } from '../types';
import { Card, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    videoWindow: {
      boxSizing: 'border-box',
      boxShadow: '0 0 1px 1px rgba(255,254,255)',
      width: `32%`,
      margin: theme.spacing(0.5),

      [theme.breakpoints.down('xs')]: {
        width: '46%',
        margin: 3,
      },
    },
    videoContainer: {
      backgroundColor: 'black',
      width: '100%',
    },
    frame: {
      paddingTop: '75%',
      backgroundColor: 'rgba(126,126,126)',
      position: 'relative',
      color: 'white',
    },
    hasTurn: {
      boxShadow: '0 0 4px 5px rgba(229, 197, 39)',
      [theme.breakpoints.down('xs')]: {
        width: '95%',
      },
    },
    hostStyle: {
      [theme.breakpoints.down('xs')]: {
        width: '95%',
      },
    },
    notActive: {
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
    placeHolderText: {
      position: 'absolute',
      top: '50%',
      bottom: 0,
      left: 0,
      right: 0,
      color: 'rgba(218, 214, 214)',
    },
    absolute: {
      width: '100%',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    noConnection: {
      textAlign: 'center',
    },
  })
);

interface RTCVideoFrameProps {
  peer: RTCPeer;
  order: number; // defines the order of video windows
}

const ErrorMsg: React.FC<{ text: string }> = ({ text, children }) => {
  const classes = useStyles();

  return (
    <div className={classes.frame}>
      <div className={classes.placeHolderText}>
        <Typography variant="body2">{text}</Typography>
      </div>
      <div className={classes.absolute}>{children}</div>
    </div>
  );
};

const RTCVideoFrame: React.FC<RTCVideoFrameProps> = ({ peer, order }) => {
  const classes = useStyles();
  const gameStatus = useSelector((state: State) => state.rtc.game?.status);
  const playerWithTurnId = useSelector(
    (state: State) => state.rtc.game?.info.turn
  );
  const style = React.useMemo(() => ({ order }), [order]);
  const overlayContent = React.useMemo(
    () =>
      peer.isHost ? (
        <HostOverlayItems host={peer} />
      ) : (
        <PlayerOverlayItems peer={peer} />
      ),
    [peer]
  );

  const isMuted = useSelector(
    (state: State) => !!state.rtc.localData.mutedMap[peer.id] || !!peer.isMe
  );

  const highlighted =
    playerWithTurnId &&
    playerWithTurnId === peer.id &&
    gameStatus &&
    gameStatus === GameStatus.RUNNING;

  return (
    <Card
      elevation={3}
      className={`${classes.videoWindow} ${
        highlighted
          ? classes.hasTurn
          : peer.isHost
          ? classes.hostStyle
          : classes.notActive
      }`}
      style={style}
    >
      {peer.stream ? (
        <VideoWithOverlay stream={peer.stream} isMuted={isMuted}>
          {overlayContent}
        </VideoWithOverlay>
      ) : (
        <div className={classes.noConnection}>
          <ErrorMsg text={'Ei videoyhteyttä'}>{overlayContent}</ErrorMsg>
        </div>
      )}
    </Card>
  );
};

export default React.memo(RTCVideoFrame);
