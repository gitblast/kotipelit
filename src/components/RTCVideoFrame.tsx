import React from 'react';

import { useSelector } from 'react-redux';

import VideoWithOverlay from './VideoWithOverlay';
import PlayerOverlayItems from './PlayerOverlayItems';
import HostOverlayItems from './HostOverlayItems';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { GamePlayer, GameStatus, RTCGame, RTCPeer, State } from '../types';
import { Card, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    videoWindow: {
      boxSizing: 'border-box',
      width: `32%`,
      margin: theme.spacing(0.5),
      textAlign: 'center',
    },
    videoContainer: {
      backgroundColor: 'grey',
      width: '100%',
    },
    frame: {
      paddingTop: '75%',
      backgroundColor: 'grey',
      position: 'relative',
    },
    hasTurn: {
      boxShadow: '0 0 7px 2px rgba(0,255,0)',
    },
    placeHolderText: {
      position: 'absolute',
      top: '50%',
      bottom: 0,
      left: 0,
      right: 0,
    },
  })
);

interface RTCVideoFrameProps {
  peer: RTCPeer;
  order: number; // defines the order of video windows
  isHost?: boolean;
}

const ErrorMsg: React.FC<{ text: string }> = ({ text }) => {
  const classes = useStyles();

  return (
    <div className={classes.frame}>
      <div className={classes.placeHolderText}>
        <Typography>{text}</Typography>
      </div>
    </div>
  );
};

const RTCVideoFrame: React.FC<RTCVideoFrameProps> = ({
  peer,
  order,
  isHost,
}) => {
  const classes = useStyles();
  const gameStatus = useSelector((state: State) => state.rtc.game?.status);
  const playerWithTurnId = useSelector(
    (state: State) => state.rtc.game?.info.turn
  );
  const style = React.useMemo(() => ({ order }), [order]);
  const highlighted =
    playerWithTurnId &&
    playerWithTurnId === peer.id &&
    gameStatus &&
    gameStatus === GameStatus.RUNNING;

  return (
    <Card
      elevation={3}
      className={`${classes.videoWindow} ${highlighted ? classes.hasTurn : ''}`}
      style={style}
    >
      {peer.stream ? (
        <VideoWithOverlay peer={peer}>
          {peer.isHost ? (
            <HostOverlayItems host={peer} />
          ) : (
            <PlayerOverlayItems playerId={peer.id} forHost={isHost} />
          )}
        </VideoWithOverlay>
      ) : (
        <ErrorMsg text={'Ei videoyhteyttä'} />
      )}
    </Card>
  );
};

export default RTCVideoFrame;
