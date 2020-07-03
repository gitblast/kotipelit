import React from 'react';

import socketIO from 'socket.io-client';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';

import HostPanel from './HostPanel';
import Results from './Results';

import { useSelector, shallowEqual } from 'react-redux';
import { State, GameStatus, SanakiertoPlayer } from '../../../../types';

import { hardcodedActiveSanakierto as HARDCODED } from '../../../../constants';
import { useParams } from 'react-router-dom';
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

// interface SanakiertoProps {}

interface ParamTypes {
  username: string;
  gameID: string;
}

const Sanakierto: React.FC = () => {
  const classes = useStyles();
  const [jitsiToken, setJitsiToken] = React.useState<null | string>(null);
  const activeGame = useSelector((state: State) => state.games.activeGame);
  const params = useParams<ParamTypes>();
  const user = useSelector((state: State) => state.user, shallowEqual);

  /** @TODO find out if socket io always uses encrypted connection and manage auth (insecure to send token if not) */
  React.useEffect(() => {
    if (!params || !params.gameID)
      throw new Error('Missing parameter "gameID"');

    const socket = socketIO();

    socket.on('create success', (data: string) => {
      setJitsiToken(data);
    });

    if (user.loggedIn) {
      socket.emit('create room', {
        gameId: params.gameID,
        hostName: user.username,
      });
    }
  }, []);

  const jitsiContent = () =>
    jitsiToken && user.loggedIn ? (
      <JitsiFrame token={jitsiToken} roomName={user.username} dev />
    ) : (
      <h4>Loading</h4>
    );

  if (activeGame === null)
    console.error('No active game found, using hard coded (dev)');

  const sortPlayersByPoints = (players: SanakiertoPlayer[]) => {
    return players.sort((a, b) => b.points - a.points);
  };

  return (
    <div className={classes.container}>
      <Paper elevation={5} className={classes.jitsiContainer}>
        {jitsiContent()}
      </Paper>
      <Paper elevation={5} className={classes.hostControls}>
        {activeGame && activeGame.status === GameStatus.FINISHED ? (
          <Results results={sortPlayersByPoints(activeGame.players)} />
        ) : (
          <HostPanel game={activeGame ? activeGame : HARDCODED} />
        )}
      </Paper>
    </div>
  );
};

export default Sanakierto;
