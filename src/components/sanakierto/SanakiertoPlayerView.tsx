import React from 'react';

import { log } from '../../utils/logger';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';

import { useSelector, shallowEqual } from 'react-redux';
import { useParams } from 'react-router';
import * as actions from '../../services/socketio/actions';

import Loader from '../Loader';
import JitsiFrame from '../JitsiFrame';
import { State, BaseUser, GameStatus, SanakiertoPlayer } from '../../types';
import WaitingRoom from './WaitingRoom';
import PlayerSidePanel from './PlayerSidePanel';
import Results from './Results';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
    },
    jitsiContainer: {
      boxSizing: 'border-box',
      width: '65%',
      backgroundColor: theme.palette.grey[400],

      height: 568,
    },
    sidePanel: {
      boxSizing: 'border-box',
      width: '35%',
      padding: theme.spacing(2),
      marginLeft: theme.spacing(1),

      height: 568,
    },
  })
);

const sortPlayersByPoints = (players: SanakiertoPlayer[]) => {
  return players.sort((a, b) => b.points - a.points);
};

interface ParamTypes {
  username: string;
  playerId: string;
}

interface SanakiertoPlayerViewProps {
  user: BaseUser;
}

const SanakiertoPlayerView: React.FC<SanakiertoPlayerViewProps> = ({
  user,
}) => {
  const classes = useStyles();
  const { username, playerId } = useParams<ParamTypes>();
  const activeGame = useSelector(
    (state: State) => state.games.activeGame,
    shallowEqual
  );

  const error = useSelector((state: State) => state.alert);

  React.useEffect(() => {
    log('initializing socket');

    actions.initPlayerSocket(username, playerId);

    return actions.tearDownSocket;
  }, []);

  const jitsiContent = () => {
    if (error) {
      return <Loader msg={error} />;
    }

    if (!user.jitsiRoom) {
      return <Loader msg={'Ladataan...'} />;
    }

    if (activeGame?.status === GameStatus.FINISHED) {
      return (
        <Loader msg={'Kiitos osallistumisesta! Muista antaa palautetta.'} />
      );
    }

    return (
      <JitsiFrame
        token={null}
        roomName={user.jitsiRoom}
        displayName={user.displayName}
        loadedCallback={() => null}
        dev
      />
    );
  };

  const sideBar = () => {
    if (error) {
      return null;
    }

    if (!user.socket || !activeGame) {
      return <Loader msg={'Yhdistetään...'} spinner />;
    }

    if (activeGame.status === GameStatus.WAITING) {
      return <WaitingRoom game={activeGame} />;
    }

    if (activeGame.status === GameStatus.FINISHED) {
      return <Results results={sortPlayersByPoints(activeGame.players)} />;
    }

    if (activeGame.status === GameStatus.RUNNING) {
      if (activeGame.info.round > activeGame.rounds) {
        return <Results results={sortPlayersByPoints(activeGame.players)} />;
      }

      return <PlayerSidePanel game={activeGame} />;
    }
  };

  return (
    <div className={classes.container}>
      <Paper elevation={5} className={classes.jitsiContainer}>
        {jitsiContent()}
      </Paper>
      <Paper elevation={5} className={classes.sidePanel}>
        {sideBar()}
      </Paper>
    </div>
  );
};

export default SanakiertoPlayerView;
