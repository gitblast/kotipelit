import React from 'react';

import { log } from '../../utils/logger';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';

import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import * as actions from '../../services/socketio/actions';

import JitsiFrame from '../JitsiFrame';
import { State, BaseUser, GameStatus, SanakiertoPlayer } from '../../types';
import WaitingRoom from './WaitingRoom';
import PlayerSidePanel from './PlayerSidePanel';
import Results from './Results';
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
    sidePanel: {
      boxSizing: 'border-box',
      width: '35%',
      padding: theme.spacing(2),
      marginLeft: theme.spacing(1),
    },
    centered: {
      display: 'flex',
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
  })
);

const InfoBox: React.FC<{ msg: string }> = ({ msg }) => {
  const classes = useStyles();

  return (
    <div className={classes.centered}>
      <Typography>{msg}</Typography>
    </div>
  );
};

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
  const history = useHistory();
  const { username, playerId } = useParams<ParamTypes>();
  const activeGame = useSelector(
    (state: State) => state.games.activeGame,
    shallowEqual
  );
  const dispatch = useDispatch();

  React.useEffect(() => {
    const initSocket = async () => {
      log('initializing socket');

      try {
        await actions.initPlayerSocket(username, playerId);
      } catch (error) {
        console.error('error initializing socket:', error.message);
      }
    };

    initSocket();

    return () => {
      log('tearing down socket');

      actions.tearDownSocket();
    };
  }, []);

  const jitsiContent = () => {
    if (!user.jitsiRoom) {
      return <InfoBox msg={'Odotetaan, että host käynnistää pelin...'} />;
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
    if (!user.socket || !activeGame) {
      return <InfoBox msg={'Yhdistetään...'} />;
    }

    if (activeGame.status === GameStatus.WAITING) {
      return <WaitingRoom game={activeGame} />;
    }

    if (activeGame.status === GameStatus.RUNNING) {
      return <PlayerSidePanel game={activeGame} />;
    }

    if (activeGame.status === GameStatus.FINISHED) {
      return <Results results={sortPlayersByPoints(activeGame.players)} />;
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
