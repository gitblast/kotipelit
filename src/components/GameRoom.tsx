import React from 'react';

import useNewGameRoom from '../hooks/useNewGameRoom';

import RTCVideoConference from './RTCVideoConference';
import RTCHostControls from './RTCHostControls';
import RTCPlayerControls from './RTCPlayerControls';
import AudioHandler from './AudioHandler';

import HeadsetIcon from '@material-ui/icons/Headset';
import HelpIcon from '@material-ui/icons/Help';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import logger, { setDebug } from '../utils/logger';
import { Backdrop, Fab, Typography } from '@material-ui/core';
import Loader from './Loader';
import { GameStatus, State } from '../types';
import { useSelector } from 'react-redux';

// import { Animated } from 'react-animated-css';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      minHeight: '92vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'linear-gradient(to bottom, #94ccc6, #1c0825)',
    },
    centered: {
      minHeight: 400,
    },
    gameTitleBar: {
      display: 'flex',
      justifyContent: 'space-around',
      width: '90%',
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
    gameTitle: {
      color: 'rgb(185 231 229)',
      marginTop: theme.spacing(3),
      fontSize: '60px',
    },
    topStyle: {
      borderTop: '15px dotted rgb(185 231 229)',
      background: 'rgb(167 203 176)',
      boxShadow: 'rgb(231 239 191) 1px 8px 44px',
      width: '30vw',
      alignSelf: 'center',
      marginTop: '15px',
    },
    startBtnContainer: {
      marginTop: theme.spacing(2),
    },
    startButton: {
      padding: theme.spacing(5),
      border: 'solid white',
    },
    infoContent: {
      display: 'flex',

      margin: 15,
    },
    startVideoBtn: {
      padding: theme.spacing(2),
      margin: 15,
    },
    backdropBottom: {
      zIndex: theme.zIndex.drawer + 1,
      backgroundColor: 'rgba(0,0,0,0.9)',
      display: 'flex',
      alignItems: 'flex-start',
      color: 'white',
      justifyContent: 'center',
    },

    backdropContent: {
      zIndex: theme.zIndex.drawer + 3,
      marginTop: theme.spacing(2),
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
  // Standard Definition video quality (x = 720, y = 480)
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
  const { game, mySelf, participants } = useNewGameRoom(token, onCall, isHost);

  const fullscreenRef = React.useRef<null | HTMLDivElement>(null);

  const handleToggleFullscreen = React.useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();

      return;
    }

    if (fullscreenRef.current) {
      fullscreenRef.current.requestFullscreen();
    }
  }, [fullscreenRef]);

  const handleStart = () => {
    if (mySelf) {
      mySelf.socket.emit('start');
    } else {
      logger.error('self was null when trying to emit start');
    }
  };

  const handleJoinCall = () => {
    if (isHost) {
      if (mySelf) {
        mySelf.socket.emit('launch');
      } else {
        logger.error('socket was null trying to emit launch');
      }
    }

    setOnCall(true);
  };

  console.log('aseta käynnistys disabled jos yli 30min alkuun!');

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
        <Typography variant="h5">Peli alkaa pian!</Typography>
        <div className={classes.infoContent}>
          <HeadsetIcon fontSize="large"></HeadsetIcon>
          <Typography>
            Käytä kuulokkeita, niin pelin äänet eivät kuulu muille pelaajille
            läpi.
          </Typography>
        </div>
        <div className={classes.infoContent}>
          <HelpIcon fontSize="large"></HelpIcon>
          <Typography>
            Jos yhteydessä on ongelmia, voit kokeilla päivittää selaimen.
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
    <div className={classes.container} ref={fullscreenRef}>
      <AudioHandler />
      <div className={classes.gameTitleBar}>
        <div className={classes.topStyle}></div>
        <Typography className={classes.gameTitle} variant="subtitle2">
          Kotitonni
        </Typography>
        <div className={classes.topStyle}></div>
      </div>

      <RTCVideoConference participants={participants} />
      {/* {isHost ? (
        <RTCHostControls handleToggleFullscreen={handleToggleFullscreen} />
      ) : (
        game.status === GameStatus.RUNNING && (
          <RTCPlayerControls handleToggleFullscreen={handleToggleFullscreen} />
        )
      )} */}

      <Backdrop
        open={game.status === GameStatus.WAITING}
        className={classes.backdropBottom}
      >
        <div className={classes.backdropContent}>
          {isHost ? (
            <>
              <Typography variant="h5">
                Odota kunnes pelaajat on online.{' '}
              </Typography>
              <div className={classes.startBtnContainer}>
                <Fab
                  color="primary"
                  variant="extended"
                  size="large"
                  onClick={handleStart}
                  className={classes.startButton}
                >
                  Aloita peli
                </Fab>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </Backdrop>
    </div>
  );
};

export default GameRoom;
