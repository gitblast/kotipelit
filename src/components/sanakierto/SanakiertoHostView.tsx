import React from 'react';

import { log } from '../../utils/logger';

import { useSelector, shallowEqual } from 'react-redux';
import { useParams, Redirect } from 'react-router';
import * as actions from '../../services/socketio/actions';
import JitsiFrame from '../JitsiFrame';
import { GameStatus, State, SanakiertoPlayer } from '../../types';
import WaitingRoom from './WaitingRoom';
import HostPanel from './HostPanel';
import Results from './Results';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { LoggedUser } from '../../types';
import Loader from '../Loader';
import { Paper } from '@material-ui/core';

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

interface ParamTypes {
  gameID: string;
}

interface SanakiertoHostViewProps {
  user: LoggedUser;
}

const SanakiertoHostView: React.FC<SanakiertoHostViewProps> = ({ user }) => {
  const classes = useStyles();

  const [error, setError] = React.useState<null | string>(null);

  const activeGame = useSelector(
    (state: State) => state.games.activeGame,
    shallowEqual
  );

  const { gameID } = useParams<ParamTypes>();
  const { jitsiToken, jitsiRoom, username, socket } = user;

  React.useEffect(() => {
    log('initializing socket');

    try {
      actions.initHostSocket(user, gameID);
    } catch (error) {
      console.error(error.message);

      setError(`Jotain meni pieleen peliä käynnistettäessä: ${error.message}`);
    }

    return actions.tearDownSocket;
  }, []);

  const sortPlayersByPoints = (players: SanakiertoPlayer[]) =>
    players.sort((a, b) => b.points - a.points);

  const jitsiContent = () => {
    if (error) {
      return <Loader msg={error} />;
    }

    if (!jitsiRoom) {
      return <Loader msg={'Käynnistetään...'} spinner />;
    }

    return (
      <JitsiFrame
        token={jitsiToken}
        roomName={jitsiRoom}
        displayName={username}
        loadedCallback={() => actions.emitJitsiReady(gameID, jitsiRoom)}
        dev
      />
    );
  };

  const sideBar = () => {
    if (error) {
      return null;
    }

    if (!socket || !activeGame) {
      return <Loader msg={''} spinner />;
    }

    if (activeGame.status === GameStatus.WAITING) {
      return (
        <WaitingRoom
          game={activeGame}
          handleStart={() => actions.startGame(gameID)}
        />
      );
    }

    if (activeGame.status === GameStatus.RUNNING) {
      // if game has ended, show results
      if (activeGame.info.round > activeGame.rounds) {
        return (
          <Results
            results={sortPlayersByPoints(activeGame.players)}
            handleTearDown={() => actions.endGame(gameID)}
          />
        );
      }

      return <HostPanel game={activeGame} />;
    }
  };

  if (activeGame?.status === GameStatus.FINISHED) {
    return <Redirect to={`/${username}`} />;
  }

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

export default SanakiertoHostView;
