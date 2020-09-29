/* eslint-disable react/no-unescaped-entities */
import React from 'react';

import { log } from '../../utils/logger';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Paper, Typography, ListItem } from '@material-ui/core';

import { useSelector, shallowEqual } from 'react-redux';
import { useParams } from 'react-router';
import * as actions from '../../services/socketio/actions';

import Loader from '../Loader';
import JitsiFrame from '../JitsiFrame';
import { State, BaseUser, GameStatus, KotitonniPlayer } from '../../types';
import WaitingRoom from './WaitingRoom';
import PlayerSidePanel from './PlayerSidePanel';
import Results from './Results';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    jitsiContainer: {
      backgroundColor: theme.palette.grey[800],
      height: 600,
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
    sidePanel: {
      padding: theme.spacing(2),
      marginLeft: theme.spacing(1),
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
    marginBottom: {
      marginBottom: 15,
    },
  })
);

const sortPlayersByPoints = (players: KotitonniPlayer[]) => {
  return players.sort((a, b) => b.points - a.points);
};

interface ParamTypes {
  username: string;
  playerId: string;
}

interface KotitonniPlayerViewProps {
  user: BaseUser;
}

const KotitonniPlayerView: React.FC<KotitonniPlayerViewProps> = ({ user }) => {
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
  }, [playerId, username]);

  const jitsiContent = () => {
    if (error) {
      return <Loader msg={error} />;
    }

    if (!user.jitsiRoom) {
      return <Loader msg={'Ladataan...'} />;
    }

    if (activeGame?.status === GameStatus.FINISHED) {
      return (
        <Loader
          msg={
            'Kiitos osallistumisesta! Mikäli pelin aikana tuli kehitysideoita, ota yhteyttä info@kotipelit.com.'
          }
        />
      );
    }

    return (
      <JitsiFrame
        token={null}
        roomName={user.jitsiRoom}
        displayName={user.displayName}
        loadedCallback={() => null}
        // eslint-disable-next-line no-undef
        dev={process && process.env.NODE_ENV === 'development'}
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

  const welcomeMsg = () => {
    if (!activeGame || activeGame.status === GameStatus.WAITING) {
      return (
        <div>
          <Typography className={classes.marginBottom} variant="h5">
            Tervetuloa pelaamaan Kotitonnia!
          </Typography>
          <Typography className={classes.marginBottom} color="primary">
            Huomioithan, että peli toimii toistaiseksi vain läppärillä /
            pöytäkoneella.
          </Typography>
          <Typography className={classes.marginBottom}>
            Tehtäväsi on keksiä sanoillesi vihjeet. Eniten pisteitä saat kun
            vain yksi kanssapelaajista arvaa sanan.
          </Typography>
          <Typography>
            Vältä antamasta henkilökohtaisia vihjeitä, kuten:
          </Typography>
          <ListItem>
            "Nähtävyys, jolla vierailimme Minnan kanssa viime joulukuussa"{' '}
          </ListItem>
          <Typography>
            Sen sijaan käytä ytimekkäitä yleisluontoisia vihjeitä
          </Typography>
          <ListItem>"Löytyy tähtimerkeistä ja Espanjasta."</ListItem>
          <ListItem>-Härkä</ListItem>
          <Typography className={classes.marginBottom}>
            Pelin maksun voi suorittaa pelinhoitajalle {username} {''}
            Mobile paylla. Pelin hinta lukee kutsuviestissä.
          </Typography>
          <Typography className={classes.marginBottom}>
            Pelinhoitaja käynnistää pelin tähän ikkunaan.
          </Typography>

          <Typography className={classes.marginBottom}>
            Hauskaa kotipeli-iltaa!
          </Typography>
        </div>
      );
    }
  };

  return (
    <div>
      {welcomeMsg()}
      <Paper className={classes.jitsiContainer}>{jitsiContent()}</Paper>

      <Paper elevation={5} className={classes.sidePanel}>
        {sideBar()}
      </Paper>
    </div>
  );
};

export default KotitonniPlayerView;
