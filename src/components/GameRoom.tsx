import React from 'react';

import useGameRoom from '../hooks/useGameRoom';
import useMediaStream from '../hooks/useMediaStream';

import InfoBar from './InfoBar';
import RTCVideoConference from './RTCVideoConference';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import logger from '../utils/logger';
import { Fab } from '@material-ui/core';
import Loader from './Loader';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      minHeight: 400,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    centered: {
      minHeight: 400,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    startBtnContainer: {
      marginTop: theme.spacing(1),
    },
  })
);

interface GameRoomProps {
  token: string | null;
  isHost?: boolean;
}

const MEDIA_CONSTRAINTS = {
  audio: true,
  // eslint-disable-next-line no-undef
  video: process.env.NODE_ENV !== 'development', // not requesting video in development
};

if (!MEDIA_CONSTRAINTS.video) {
  console.warn('not requesting video in GameRoom -component');
}

const GameRoom: React.FC<GameRoomProps> = ({ token, isHost }) => {
  const classes = useStyles();

  const [onCall, setOnCall] = React.useState<boolean>(false);
  const [mediaStream, mediaStreamError] = useMediaStream(
    onCall,
    MEDIA_CONSTRAINTS
  );
  const [game, peers, socket] = useGameRoom(token, mediaStream);

  if (mediaStreamError) {
    console.error('error', mediaStreamError);
  }

  React.useEffect(() => {
    if (peers) {
      logger.log('PEERS CHANGED:', peers);
    }
  }, [peers]);

  const emitWithSocket = React.useCallback(
    (event: string, data?: unknown) => {
      if (!socket) {
        logger.error(
          `unexpected error: socket was null when trying to emit ${event}`
        );
      } else {
        logger.log(`emitting '${event}'`, data);
      }

      // sets game status as waiting triggering "starting soon" -screen
      socket?.emit('launch');
    },
    [socket]
  );

  const handleJoinCall = React.useCallback(() => {
    if (isHost) {
      emitWithSocket('launch');
    }

    setOnCall(true);
  }, [socket, isHost]);

  const peersWithOwnStreamSet = React.useCallback(() => {
    if (!peers) {
      return null;
    }

    return peers.map((peer) => {
      return peer.isMe ? { ...peer, stream: mediaStream } : peer;
    });
  }, [mediaStream, peers]);

  if (!game) {
    return (
      <div className={classes.centered}>
        <Loader msg={'Ladataan'} spinner />
      </div>
    );
  }

  if (!onCall) {
    return (
      <div className={classes.centered}>
        <Fab variant="extended" onClick={handleJoinCall}>
          Käynnistä video
        </Fab>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <InfoBar game={game} />
      <RTCVideoConference peers={peersWithOwnStreamSet()} game={game} />
      {isHost && (
        <div className={classes.startBtnContainer}>
          <Fab
            variant="extended"
            size="large"
            onClick={() => emitWithSocket('start')}
          >
            Aloita peli
          </Fab>
        </div>
      )}
    </div>
  );
};

export default GameRoom;
