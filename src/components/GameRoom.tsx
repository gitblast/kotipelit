import React from 'react';

import useGameRoom from '../hooks/useGameRoom';

import RTCVideoConference from './RTCVideoConference';
import RTCHostControls from './RTCHostControls';
import RTCPlayerControls from './RTCPlayerControls';
import AudioHandler from './AudioHandler';

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
    },
    startBtnContainer: {
      marginTop: theme.spacing(2),
    },
    infoContent: {
      margin: 15,
    },
    infoTitle: {
      margin: 15,
    },
    startVideoBtn: {
      padding: theme.spacing(2),
      margin: 15,
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
    examples: {
      marginTop: theme.spacing(2),
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
  video: {
    width: {
      min: 320,
      max: 720,
    },
    height: {
      min: 240,
      max: 480,
    },
  },
};

if (!MEDIA_CONSTRAINTS.video) {
  console.warn('not requesting video in GameRoom -component');
}

const GameRoom: React.FC<GameRoomProps> = ({ token, isHost }) => {
  const classes = useStyles();
  const [onCall, setOnCall] = React.useState<boolean>(false);
  const peers = useGameRoom(token, onCall, MEDIA_CONSTRAINTS);

  const game = useSelector((state: State) => state.rtc.game);
  const socket = useSelector((state: State) => state.rtc.self?.socket);

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
      <div className={classes.container}>
        <Typography className={classes.infoTitle} variant="h5">
          Tervetuloa pelaamaan Kotitonnia!
        </Typography>
        <div className={classes.infoContent}>
          <Typography>
            Pidä vinkkisi ytimekkäinä, jotta kanssapelaajien ja pelijuontajan on
            helppo muistaa ne.
          </Typography>
          <Typography>
            Tarvitset pelaamiseen web-kameran. Mikäli yhteydessä on ongelmia,
            voit kokeilla päivittää selaimen.
          </Typography>
          <Typography variant="body2">
            **Jotkin työpaikan tietokoneet blokkaavat pelaamiseen tarvittavan
            yhteyden. Jos mahdollista, käytä kotikonetta.
          </Typography>

          <Typography className={classes.examples}>
            &quot;Löytyy Espanjasta ja tähtimerkeistä&quot; <br />
            -Sexy Arvi (Spektaakkelin viihdelajien mestari)
          </Typography>
          <Typography className={classes.examples}>
            &quot;Dostojevski käsittelee tätä teoksessaan&quot; <br />
            -King Pampo (Historian ensimmäinen Kotitonnivihje)
          </Typography>
        </div>
        <Fab
          className={classes.startVideoBtn}
          variant="extended"
          color="secondary"
          onClick={handleJoinCall}
          id="start"
        >
          Käynnistä video
        </Fab>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <AudioHandler />

      <RTCVideoConference peers={peers} />
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
            <>
              <Typography>Odota kunnes pelaajat on online. </Typography>
              <Typography>Hauskaa kotipeli-iltaa! </Typography>
              <div className={classes.startBtnContainer}>
                <Fab
                  color="primary"
                  variant="extended"
                  size="large"
                  onClick={handleStart}
                >
                  Aloita peli
                </Fab>
              </div>
            </>
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
