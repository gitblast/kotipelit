import React from 'react';

import { log } from '../../utils/logger';
import * as actions from '../../services/socketio.actions';
import socketService from '../../services/socketio';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';

import HostPanel from './HostPanel';
import Results from './Results';
import PlayerSidePanel from './PlayerSidePanel';

import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { State, GameStatus, SanakiertoPlayer } from '../../types';

import { useParams, useLocation } from 'react-router-dom';
import JitsiFrame from '../JitsiFrame';
import WaitingRoom from './WaitingRoom';
import { setSocket } from '../../reducers/user.reducer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
    },
    jitsiContainer: {
      boxSizing: 'border-box',
      width: '65%',
      backgroundColor: theme.palette.grey[400],
    },
    hostControls: {
      boxSizing: 'border-box',
      width: '35%',
      padding: theme.spacing(2),
      marginLeft: theme.spacing(1),
    },
  })
);

const getPlayerIDFromQuery = (location: { search: string }) => {
  const params = new URLSearchParams(location.search);

  return params.get('pelaaja');
};

// interface SanakiertoProps {}

interface ParamTypes {
  username: string;
  gameID: string;
}

const Sanakierto: React.FC = () => {
  const classes = useStyles();
  const activeGame = useSelector((state: State) => state.games.activeGame);
  const { gameID } = useParams<ParamTypes>();
  const user = useSelector((state: State) => state.user, shallowEqual);
  const socket = useSelector((state: State) => state.user.socket);
  const jitsiRoom = useSelector((state: State) => state.user.jitsiRoom);
  const location = useLocation();
  const dispatch = useDispatch();

  /** @TODO find out if socket io always uses encrypted connection and manage auth (insecure to send token if not) */
  React.useEffect(() => {
    if (!socket) {
      log('initializing socket');

      if (user.loggedIn) {
        dispatch(setSocket(socketService.initHostSocket(user, gameID)));
      } else {
        socketService
          .initPlayerSocket(gameID, getPlayerIDFromQuery(location))
          .then((authedSocket) => dispatch(setSocket(authedSocket)))
          .catch((error) => console.error(error.message));
      }
    }
  }, []);

  const handleStartGame = (gameId: string): void => {
    actions.startGame(gameId);
  };

  const handleJitsiLoaded = (gameId: string, jitsiRoom: string): void => {
    actions.emitJitsiReady(gameId, jitsiRoom);
  };

  const jitsiContent = () => {
    if (!gameID || !jitsiRoom) {
      if (user.loggedIn) {
        return <Typography>Ladataan...</Typography>;
      }

      return <Typography>Odotetaan, että host käynnistää pelin...</Typography>;
    }

    return (
      <JitsiFrame
        token={user.loggedIn ? user.jitsiToken : null}
        roomName={jitsiRoom}
        handleLoaded={() => handleJitsiLoaded(gameID, jitsiRoom)}
        dev
      />
    );
  };

  const sortPlayersByPoints = (players: SanakiertoPlayer[]) => {
    return players.sort((a, b) => b.points - a.points);
  };

  const sideBar = () => {
    if (!socket || !activeGame) return <Typography>Yhdistetään...</Typography>;

    if (activeGame.status === GameStatus.WAITING) {
      return (
        <WaitingRoom
          game={activeGame}
          handleStart={user.loggedIn ? () => handleStartGame(gameID) : null}
        />
      );
    }

    if (activeGame.status === GameStatus.RUNNING) {
      return user.loggedIn ? (
        <HostPanel game={activeGame} />
      ) : (
        <PlayerSidePanel game={activeGame} />
      );
    }

    return <Results results={sortPlayersByPoints(activeGame.players)} />;
  };

  return (
    <div className={classes.container}>
      <Paper elevation={5} className={classes.jitsiContainer}>
        {jitsiContent()}
      </Paper>
      <Paper elevation={5} className={classes.hostControls}>
        {sideBar()}
      </Paper>
    </div>
  );
};

export default Sanakierto;
