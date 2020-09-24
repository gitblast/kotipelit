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
    },
    sidePanel: {
      padding: theme.spacing(2),
      marginLeft: theme.spacing(1),
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
          <Typography variant="h5">Tervetuloa pelaamaan Kotitonnia!</Typography>
          <Typography>
            Tehtäväsi on keksiä sanoillesi vihjeet. Eniten pisteitä saat kun
            vain yksi kanssapelaajista arvaa sanan. Vältä antamasta
            henkilökohtaisia vihjeitä, kuten:
          </Typography>
          <ListItem>
            "Nähtävyys, jolla vierailimme Minnan kanssa viime joulukuussa"{' '}
          </ListItem>
          <Typography>
            Sen sijaan käytä ytimekkäitä yleisluontoisia vihjeitä
          </Typography>
          <ListItem>"Dostojevski käsittelee tätä teoksessaan"</ListItem>
          <ListItem>-Rangaistus</ListItem>
          <Typography>
            Maksun "pelin hinta" voi suorittaa pelinhoitajalle "{username}"
            Mobile paylla.
          </Typography>
          <Typography>
            Peli käynnistyy tähän ikkunaan "time left" kuluttua.
          </Typography>
          <Typography>Hauskaa kotipeli-iltaa!</Typography>
        </div>
      );
    }
  };

  return (
    <div>
      {/* Alla vain pelaajalle näytettävä welcomeMsg. Backendista tarviis pelin hinnan, houstin nimen ja jäljellä olevan odotusajan. 
      Jätin toistaseks turhat stailit pois kun en varma mihin fileen tää tulis laittaa  */}
      {welcomeMsg()}
      <Paper className={classes.jitsiContainer}>{jitsiContent()}</Paper>
      {/* Näkykö pelaajien online status jo ennenkuin host oli käynnistäny peliä? 
      Vai oonko hukannu sen johonkin tästä näkymästä? Se tulee näkyviin samalla kun tulee host käynnistää peli-ikkunan dashboardista.*/}
      <Paper elevation={5} className={classes.sidePanel}>
        {sideBar()}
      </Paper>
    </div>
  );
};

export default KotitonniPlayerView;
