import React from 'react';

import useGameRoom from '../hooks/useGameRoom';
import useMediaStream from '../hooks/useMediaStream';

import InfoBar from './InfoBar';
import RTCVideoConference from './RTCVideoConference';
import RTCHostControls from './RTCHostControls';
import RTCPlayerControls from './RTCPlayerControls';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import logger, { setDebug } from '../utils/logger';
import { Backdrop, Fab, Typography } from '@material-ui/core';
import Loader from './Loader';
import { GameStatus, State } from '../types';
import { useSelector } from 'react-redux';

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
      marginTop: theme.spacing(2),
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      backgroundColor: 'rgba(0,0,0,0.8)',
      color: 'white',
    },
    backdropContent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  })
);

interface GameRoomProps {
  token: string | null;
  isHost?: boolean;
}

console.log('setting logger debug to true in gameroom component');

setDebug(true);

const MEDIA_CONSTRAINTS = {
  audio: true,
  // eslint-disable-next-line no-undef
  video: true, // process.env.NODE_ENV !== 'development', // not requesting video in development: process.env.NODE_ENV !== 'development',
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
  const [peers] = useGameRoom(token, mediaStream);

  const peersWithOwnStreamSet = React.useMemo(() => {
    if (!peers) {
      return null;
    }

    return peers.map((peer) => {
      return peer.isMe ? { ...peer, stream: mediaStream } : peer;
    });
  }, [mediaStream, peers]);

  const game = useSelector((state: State) => state.rtc.game);
  const socket = useSelector((state: State) => state.rtc.self?.socket);

  if (mediaStreamError) {
    console.error('error', mediaStreamError);
  }

  React.useEffect(() => {
    if (peers) {
      logger.log('PEERS CHANGED:', peers);
    }
  }, [peers]);

  const handleStart = () => {
    if (socket) {
      socket.emit('start');
    } else {
      logger.error('socket was null when trying to emit start');
    }
  };

  const handleJoinCall = () => {
    if (isHost) {
      if (socket) {
        socket.emit('launch');
      } else {
        logger.error('socket was null trying to emit launch');
      }
    }

    setOnCall(true);
  };

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
      <InfoBar />
      <RTCVideoConference peers={peersWithOwnStreamSet} />
      {isHost ? (
        <RTCHostControls />
      ) : (
        game.status === GameStatus.RUNNING && <RTCPlayerControls />
      )}
      <Backdrop
        open={game.status === GameStatus.WAITING}
        className={classes.backdrop}
      >
        <div className={classes.backdropContent}>
          <Typography variant="h2" component="div">
            Kotitonni
          </Typography>
          {isHost ? (
            <div className={classes.startBtnContainer}>
              <Fab variant="extended" size="large" onClick={handleStart}>
                Aloita peli
              </Fab>
            </div>
          ) : (
            <Typography variant="h6" component="div">
              Peli alkaa hetken kuluttua...
            </Typography>
          )}
        </div>
      </Backdrop>
    </div>
  );
};

export default GameRoom;
