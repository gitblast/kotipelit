import { Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import useNewGameRoom from '../hooks/useNewGameRoom';
import { GameStatus, Role } from '../types';
import logger, { setDebug } from '../utils/logger';
import AudioHandler from './AudioHandler/AudioHandler';
import ErrorFallBack from './ErrorFallBack';
import Loader from './Loader';
import GameDataProvider from './GameDataProvider/GameDataProvider';
import PreGameInfo from './PreGameInfo';
import RTCHostControls from './RTCHostControls';
import RTCPlayerControls from './RTCPlayerControls';
import RTCVideoConference from './RTCVideoConference';

// import { Animated } from 'react-animated-css';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    containerGame: {
      // Effecting how it shows on fullscreen?
      minHeight: '91vh',
      background: 'linear-gradient(to bottom, rgb(32 82 100), rgb(14 25 30))',
    },
    centered: {
      minHeight: 400,
    },
    topGradient: {
      background: 'linear-gradient(to bottom, rgb(11 42 56), rgb(32 82 100))',
      height: 30,
      width: '100%',
    },
    gameTitleBar: {
      display: 'flex',
      justifyContent: 'space-around',
    },
    kotitonniTitle: {
      fontSize: '5.2rem',
      color: 'rgb(185 231 229)',
    },
    kotipelit: {
      position: 'relative',
      top: -21,
      left: 219,
      fontSize: '0.8rem',
      color: 'rgb(185 231 229)',
    },
    topStyle: {
      borderTop: '22px dotted rgb(185 231 229)',
      background: 'rgb(86 124 123)',
      boxShadow: 'rgb(231 239 191) 1px 8px 44px',
      width: '30vw',
      alignSelf: 'center',
      marginTop: '15px',
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
    startBtnContainer: {
      position: 'absolute',
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
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  })
);

interface GameRoomProps {
  token: string | null;
  role: Role;
}

console.log('setting logger debug to true in gameroom component');

setDebug(true);

const GameRoom: React.FC<GameRoomProps> = ({ token, role }) => {
  const isHost = role === Role.HOST;
  const classes = useStyles();
  const {
    game,
    updateGame,
    mySelf,
    socket,
    participants,
    spectatorCount,
    onCall,
    handleJoinCall,
  } = useNewGameRoom(token, role);

  React.useEffect(() => {
    logger.log('participants changed:', participants);
  }, [participants]);

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

  if (!game || !socket || !mySelf) {
    return (
      <div className={classes.centered}>
        <Loader msg={'Ladataan..'} spinner />
      </div>
    );
  }

  if (!onCall) {
    return (
      <PreGameInfo
        canJoin={isHost || game.status !== GameStatus.UPCOMING}
        handleJoinCall={handleJoinCall}
        isSpectator={role === Role.SPECTATOR}
      />
    );
  }
  return (
    <ErrorBoundary FallbackComponent={ErrorFallBack}>
      <GameDataProvider
        game={game}
        updateGame={updateGame}
        self={mySelf}
        socket={socket}
      >
        <div className={classes.containerGame} ref={fullscreenRef}>
          <AudioHandler />
          <div className={classes.topGradient}></div>
          <div className={classes.gameTitleBar}>
            {/* For animation, should more topStyle divs be added? */}
            <div className={classes.topStyle}></div>
            <div>
              <Typography variant="overline" className={classes.kotitonniTitle}>
                Kotitonni
              </Typography>
              <Typography className={classes.kotipelit}>
                Kotipelit.com
              </Typography>
            </div>

            <div className={classes.topStyle}></div>
          </div>

          <RTCVideoConference participants={participants} />
          {role === Role.SPECTATOR ? null : isHost ? (
            <RTCHostControls
              spectatorCount={spectatorCount}
              handleToggleFullscreen={handleToggleFullscreen}
            />
          ) : (
            game.status === GameStatus.RUNNING && (
              <RTCPlayerControls
                handleToggleFullscreen={handleToggleFullscreen}
              />
            )
          )}
        </div>
      </GameDataProvider>
    </ErrorBoundary>
  );
};

export default GameRoom;
