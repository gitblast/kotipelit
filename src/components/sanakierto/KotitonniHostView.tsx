/* eslint-disable react/no-unescaped-entities */
import React from 'react';

import { log } from '../../utils/logger';

import { useSelector, shallowEqual } from 'react-redux';
import { useParams, Redirect } from 'react-router';
import * as actions from '../../services/socketio/actions';
import JitsiFrame from '../JitsiFrame';
import { GameStatus, State, KotitonniPlayer } from '../../types';
import HostPanel from './HostPanel';
import Results from './Results';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  Badge,
  Fab,
  Grid,
  List,
  ListItem,
  Typography,
} from '@material-ui/core';
import { LoggedUser } from '../../types';
import Loader from '../Loader';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
    },
    jitsiContainer: {
      width: '100%',
      backgroundColor: theme.palette.grey[800],
      height: 600,
    },
    hostControls: {
      boxSizing: 'border-box',
      padding: theme.spacing(2),
      marginLeft: theme.spacing(1),
    },
    headLine: {
      paddingBottom: 15,
    },
    welcomeMsg: {
      marginBottom: 40,
    },
    participants: {
      display: 'flex',
      justifyContent: 'space-around',
    },
    startBtn: {
      textAlign: 'center',
      margin: theme.spacing(2),
    },
    btnStart: {
      textAlign: 'center',

      padding: 45,
    },
    flexing: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  })
);

interface ParamTypes {
  gameID: string;
}

interface KotitonniHostViewProps {
  user: LoggedUser;
}

const KotitonniHostView: React.FC<KotitonniHostViewProps> = ({ user }) => {
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
      actions.initHostSocket(gameID);
    } catch (error) {
      console.error(error.message);

      setError(`Jotain meni pieleen peliä käynnistettäessä: ${error.message}`);
    }

    return actions.tearDownSocket;
  }, [gameID]);

  const sortPlayersByPoints = (players: KotitonniPlayer[]) =>
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
        // eslint-disable-next-line no-undef
        dev={process && process.env.NODE_ENV === 'development'}
        isHost
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
    <Grid container spacing={5} className={classes.container}>
      {!activeGame ||
        (activeGame.status === GameStatus.WAITING && (
          <div className={classes.flexing}>
            <div className={classes.welcomeMsg}>
              <Typography className={classes.headLine} variant="h5">
                Kiitos kun houstaat pelejä!
              </Typography>
              <Typography>Tässä muutama vinkki:</Typography>
              <List>
                <ListItem>
                  1. Voit testata ennen peliä, että kamerayhteys toimii,
                  klikkaamalla "käynnistä video"
                </ListItem>
                <ListItem>
                  2. Pelin aikana voit toistaa pelaajan antaman vihjeen, jotta
                  kaikki varmasti kuulevat sen
                </ListItem>
                <ListItem>
                  3. Voit ajoittain mutettaa pelaajan jos taustalta kuuluu
                  paljon melua
                </ListItem>
                <ListItem>
                  4. Peli aukeaa tähän ikkunaan kun klikkaat "Aloita peli"
                </ListItem>
              </List>

              <Typography>Hauskaa kotipeli-iltaa!</Typography>
            </div>
            <div>
              <div className={classes.startBtn}>
                <Fab
                  onClick={() => actions.startGame(gameID)}
                  variant="extended"
                  size="large"
                  color="primary"
                  className={classes.btnStart}
                >
                  Aloita peli
                </Fab>
              </div>
            </div>
            <div></div>
          </div>
        ))}
      <Grid item xs={12} className={classes.jitsiContainer}>
        {jitsiContent()}
      </Grid>
      <Grid item xs={12} className={classes.hostControls}>
        {sideBar()}
      </Grid>
      {activeGame && activeGame.status === GameStatus.WAITING && (
        <Grid item xs={12} className={classes.participants}>
          {activeGame.players.map((p) => (
            <div key={p.id}>
              <Typography className={classes.participants}>
                {p.name}
                {p.online ? (
                  <Badge variant="dot" color="secondary"></Badge>
                ) : (
                  <Badge variant="dot" color="error"></Badge>
                )}
              </Typography>
            </div>
          ))}
        </Grid>
      )}
    </Grid>
    // <div className={classes.container}>
    //   <Paper elevation={5} className={classes.jitsiContainer}>
    //     {jitsiContent()}
    //   </Paper>
    //   <Paper elevation={5} className={classes.hostControls}>
    //     {sideBar()}
    //   </Paper>
    // </div>
  );
};

export default KotitonniHostView;
