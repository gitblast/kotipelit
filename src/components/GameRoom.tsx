import React from 'react';

import useGameRoom from '../hooks/useGameRoom';
import useMediaStream from '../hooks/useMediaStream';

import InfoBar from './InfoBar';
import RTCVideoConference from './RTCVideoConference';
import RTCHostControls from './RTCHostControls';
import RTCPlayerControls from './RTCPlayerControls';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import logger from '../utils/logger';
import { Backdrop, Fab, Typography } from '@material-ui/core';
import Loader from './Loader';
import { GameStatus, RTCGame } from '../types';

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
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
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
      if (socket) {
        data ? socket.emit(event, data) : socket.emit(event);
      }
    },
    [socket]
  );

  const peerSelf = React.useMemo(() => peers?.find((p) => p.isMe), [peers]);
  const playerSelf = React.useMemo(() => {
    if (isHost || !game || !peerSelf) {
      return null;
    }

    const self = game.players.find((p) => p.id === peerSelf.id);

    return self ? self : null;
  }, [game, peerSelf, isHost]);

  const canAnswer = React.useMemo(() => {
    if (
      !game ||
      !playerSelf ||
      !playerSelf.answers ||
      !playerSelf.answers[game.info.turn]
    ) {
      return false;
    }

    const answer = playerSelf.answers[game.info.turn][game.info.round];

    console.log('ans', answer);

    return !answer;
  }, [playerSelf, game]);

  const emitStart = React.useCallback(() => emitWithSocket('start'), [
    emitWithSocket,
  ]);

  const emitUpdate = React.useCallback(
    (newGame: RTCGame) => emitWithSocket('update-game', newGame),
    [emitWithSocket]
  );

  const handleJoinCall = React.useCallback(() => {
    if (isHost) {
      emitWithSocket('launch');
    }

    setOnCall(true);
  }, [socket, isHost]);

  const peersWithOwnStreamSet = React.useMemo(() => {
    if (!peers) {
      return null;
    }

    return peers.map((peer) => {
      return peer.isMe ? { ...peer, stream: mediaStream } : peer;
    });
  }, [mediaStream, peers]);

  const handlePlayerAnswer = React.useCallback(
    (answer: string) => {
      if (game) {
        const answerObj = {
          answer,
          info: game.info,
        };

        emitWithSocket('answer', answerObj);
      } else {
        logger.error('no game was set when trying to answer');
      }
    },
    [game, emitWithSocket]
  );

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
      <InfoBar game={game} isHost={isHost} />
      <RTCVideoConference
        peers={peersWithOwnStreamSet}
        game={game}
        isHost={isHost}
      />
      {isHost ? (
        game.status === GameStatus.RUNNING && (
          <RTCHostControls game={game} handleUpdate={emitUpdate} />
        )
      ) : (
        <RTCPlayerControls
          disabled={!canAnswer}
          handleUpdate={handlePlayerAnswer}
        />
      )}
      <Backdrop
        open={game.status === GameStatus.WAITING}
        className={classes.backdrop}
      >
        <div className={classes.backdropContent}>
          <Typography variant="h1" component="div">
            Kotipelit.com
          </Typography>
          {isHost ? (
            <div className={classes.startBtnContainer}>
              <Fab variant="extended" size="large" onClick={emitStart}>
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
