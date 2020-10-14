import React from 'react';

import VideoWithOverlay from './VideoWithOverlay';
import PlayerOverlayItems from './PlayerOverlayItems';
import HostOverlayItems from './HostOverlayItems';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { GamePlayer, RTCGame, RTCPeer } from '../types';
import { Card, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    videoWindow: {
      boxSizing: 'border-box',
      boxShadow: '0 0 1px 1px rgba(255,254,255)',
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
      backgroundColor: 'rgba(43,16,8)',
      position: 'relative',
      color: 'white',
    },
    hasTurn: {
      boxShadow: '0 0 7px 2px rgba(19,116,78)',
    },
    placeHolderText: {
      position: 'absolute',
      top: '50%',
      bottom: 0,
      left: 0,
      right: 0,
      color: 'rgba(222,222,222)',
    },
  })
);

interface RTCVideoFrameProps {
  peer: RTCPeer;
  player: GamePlayer | undefined;
  order: number; // defines the order of video windows
  game: RTCGame;
  highlightTurn?: boolean;
  isHost?: boolean;
}

const ErrorMsg: React.FC<{ text: string }> = ({ text }) => {
  const classes = useStyles();

  return (
    <div className={classes.frame}>
      <div className={classes.placeHolderText}>
        <Typography variant="body2">{text}</Typography>
      </div>
    </div>
  );
};

const RTCVideoFrame: React.FC<RTCVideoFrameProps> = ({
  peer,
  player,
  order,
  game,
  highlightTurn,
  isHost,
}) => {
  const classes = useStyles();

  const style = React.useMemo(() => ({ order }), [order]);

  return (
    <Card
      elevation={3}
      className={`${classes.videoWindow} ${
        player?.hasTurn && highlightTurn ? classes.hasTurn : ''
      }`}
      style={style}
    >
      {peer.stream ? (
        <VideoWithOverlay peer={peer}>
          {peer.isHost ? (
            <HostOverlayItems host={peer} gameType={game.type} />
          ) : player ? (
            <PlayerOverlayItems player={player} game={game} forHost={isHost} />
          ) : (
            <ErrorMsg text={'Odottamaton virhe: pelaajaa ei löytynyt'} />
          )}
        </VideoWithOverlay>
      ) : (
        <ErrorMsg text={'Ei videoyhteyttä'} />
      )}
    </Card>
  );
};

export default RTCVideoFrame;
