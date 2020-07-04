import React from 'react';

import { log } from '../../../../utils/logger';
import * as actions from '../../../../services/socketio.actions';
import socketService from '../../../../services/socketio';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';

import HostPanel from './HostPanel';
import Results from './Results';

import { useSelector, shallowEqual } from 'react-redux';
import { State, GameStatus, SanakiertoPlayer } from '../../../../types';

import { hardcodedActiveSanakierto as HARDCODED } from '../../../../constants';
import { useParams, useLocation } from 'react-router-dom';
import JitsiFrame from '../../../JitsiFrame';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
    },
    jitsiContainer: {
      width: '65%',
      padding: theme.spacing(2),
      backgroundColor: theme.palette.grey[400],
    },
    hostControls: {
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
  const [socket, setSocket] = React.useState<SocketIOClient.Socket | null>(
    null
  );
  const activeGame = useSelector((state: State) => state.games.activeGame);
  const { gameID } = useParams<ParamTypes>();
  const user = useSelector((state: State) => state.user, shallowEqual);
  const location = useLocation();

  /** @TODO find out if socket io always uses encrypted connection and manage auth (insecure to send token if not) */
  React.useEffect(() => {
    if (!socket) {
      log('initializing socket');

      if (user.loggedIn) {
        setSocket(socketService.initHostSocket(user, gameID));
      } else {
        socketService
          .initPlayerSocket(gameID, getPlayerIDFromQuery(location))
          .then((authedSocket) => setSocket(authedSocket))
          .catch((error) => console.error(error.message));
      }
    }
  });

  const handleJitsiLoaded = (
    socket: SocketIOClient.Socket,
    gameId: string,
    jitsiRoom: string
  ): void => {
    actions.emitJitsiReady(socket, gameId, jitsiRoom);
  };

  const jitsiContent = () => {
    return user.loggedIn && user.jitsiToken && socket && gameID ? (
      <JitsiFrame
        token={user.jitsiToken}
        roomName={`${user.username}/${gameID}`}
        handleLoaded={() =>
          handleJitsiLoaded(socket, gameID, `${user.username}/${gameID}`)
        }
        dev
      />
    ) : (
      <h4>Loading</h4>
    );
  };

  if (activeGame === null)
    console.error('No active game found, using hard coded (dev)');

  const sortPlayersByPoints = (players: SanakiertoPlayer[]) => {
    return players.sort((a, b) => b.points - a.points);
  };

  const sideBar = () => {
    if (!user.loggedIn) return <div>Player sidebar</div>;

    return activeGame && activeGame.status === GameStatus.FINISHED ? (
      <Results results={sortPlayersByPoints(activeGame.players)} />
    ) : (
      <HostPanel game={activeGame ? activeGame : HARDCODED} />
    );
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
