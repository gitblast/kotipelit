import { Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import useNewGameRoom from '../hooks/useNewGameRoom';
import { GameStatus, Role } from '../types';
import logger, { setDebug } from '../utils/logger';
import AudioHandler from './AudioHandler/AudioHandler';
import Loader from './Loader';
import GameDataProvider from './GameDataProvider/GameDataProvider';
import PreGameInfo from './PreGameInfo';
import RTCHostControls from './RTCHostControls';
import RTCPlayerControls from './RTCPlayerControls';
import RTCVideoConference from './RTCVideoConference';
import { useGameErrorState } from '../context';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    containerGame: {
      // Effecting how it shows on fullscreen?
      minHeight: '91vh',
      background: 'linear-gradient(to bottom, rgb(32 82 100), rgb(28 47 56))',
    },
    containerGameWait: {
      // Effecting how it shows on fullscreen?
      minHeight: '91vh',
      background: 'rgb(11 43 56)',
    },
    centered: {
      minHeight: 400,
      textAlign: 'center',
    },
    topGradient: {
      background: 'linear-gradient(to bottom, rgb(11 42 56), rgb(32 82 100))',
      height: 30,
      width: '100%',
    },
    topGradientWait: {
      background: 'rgb(11 43 56)',
      height: 30,
      width: '100%',
    },
    gameTitleBar: {
      display: 'flex',
      justifyContent: 'space-around',
    },
    kotitonniTitleWait: {
      fontSize: '5.2rem',
      color: 'rgb(185, 231, 229, 16%)',
      [theme.breakpoints.down('sm')]: {
        fontSize: '3.8rem',
      },
    },
    kotitonniTitle: {
      fontSize: '5.2rem',
      color: 'rgb(185 231 229)',
      [theme.breakpoints.down('sm')]: {
        fontSize: '3.8rem',
      },
    },
    kotipelit: {
      position: 'relative',
      top: -9,
      left: 190,
      fontSize: '0.85rem',
      color: 'rgb(185 231 229)',
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
    kotipelitWait: {
      position: 'relative',
      top: -9,
      left: 190,
      fontSize: '0.85rem',
      color: 'rgb(185, 231, 229, 16%)',
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
    topStyleWait: {
      borderTop: '22px dotted rgb(185, 231, 229, 16% )',
      width: '30vw',
      alignSelf: 'center',
      marginTop: '15px',
      [theme.breakpoints.down('xs')]: {
        width: '20vw',
        borderTop: '15px dotted rgb(185 231 229)',
      },
    },
    topStyle: {
      borderTop: '22px dotted rgb(185 231 229)',
      background: 'rgb(103 136 129)',
      boxShadow: 'rgb(231 239 191) 1px 8px 44px',
      width: '30vw',
      alignSelf: 'center',
      [theme.breakpoints.down('xs')]: {
        width: '20vw',
        borderTop: '15px dotted rgb(185 231 229)',
      },
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

  const { errorState } = useGameErrorState();

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
        <Loader msg={'Ladataan..'} spinner errored={!!errorState} />
      </div>
    );
  }

  if (!onCall) {
    return (
      <PreGameInfo game={game} handleJoinCall={handleJoinCall} role={role} />
    );
  }
  return (
    <GameDataProvider
      game={game}
      updateGame={updateGame}
      self={mySelf}
      socket={socket}
    >
      <div
        className={`${
          game.status === GameStatus.RUNNING ||
          game.status === GameStatus.FINISHED
            ? classes.containerGame
            : classes.containerGameWait
        }`}
        ref={fullscreenRef}
      >
        <AudioHandler />
        <div
          className={`${
            game.status === GameStatus.RUNNING ||
            game.status === GameStatus.FINISHED
              ? classes.topGradient
              : classes.topGradientWait
          }`}
        ></div>
        <div className={classes.gameTitleBar}>
          {/* For animation, should more topStyle divs be added? */}
          <div
            className={`${
              game.status === GameStatus.RUNNING ||
              game.status === GameStatus.FINISHED
                ? classes.topStyle
                : classes.topStyleWait
            }`}
          ></div>
          <div>
            <Typography
              variant="subtitle1"
              className={`${
                game.status === GameStatus.RUNNING ||
                game.status === GameStatus.FINISHED
                  ? classes.kotitonniTitle
                  : classes.kotitonniTitleWait
              }`}
            >
              Kotitonni
            </Typography>
            <Typography
              className={`${
                game.status === GameStatus.RUNNING ||
                game.status === GameStatus.FINISHED
                  ? classes.kotipelit
                  : classes.kotipelitWait
              }`}
            >
              kotipelit.com
            </Typography>
          </div>

          <div
            className={`${
              game.status === GameStatus.RUNNING ||
              game.status === GameStatus.FINISHED
                ? classes.topStyle
                : classes.topStyleWait
            }`}
          ></div>
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
  );
};

export default GameRoom;
