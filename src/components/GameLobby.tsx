import React from 'react';

import References from './References';
import LockReservationForm from './LockReservationForm';

import useLobbySystem from '../hooks/useLobbySystem';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Fab, Typography, Grid, Paper } from '@material-ui/core';
import { LobbyGamePlayer } from '../types';
import Loader from './Loader';
import { capitalize } from 'lodash';
import { format } from 'date-fns';
import fiLocale from 'date-fns/locale/fi';
import logger from '../utils/logger';

import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

import Footer from './Footer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      [theme.breakpoints.down('xs')]: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
      },
    },
    centerAlign: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    availableSeat: {
      color: 'rgb(104 122 106)',
    },
    reserveBtn: {
      padding: theme.spacing(4),
      margin: theme.spacing(2),
    },
    bookedText: {
      color: 'red',
    },
    gameRules: {
      padding: theme.spacing(4),
      marginTop: theme.spacing(6),
      marginLeft: theme.spacing(6),
      marginRight: theme.spacing(6),
      backgroundColor: 'rgb(175, 227, 222)',
      [theme.breakpoints.down('xs')]: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
      },
    },
    pointsExplained: {
      display: 'flex',
      justifyContent: 'space-around',
      textAlign: 'center',
      marginTop: theme.spacing(2),
    },
    registeredInfo: {
      padding: theme.spacing(2),
      marginTop: theme.spacing(2),
      backgroundColor: 'transparent',
      [theme.breakpoints.down('xs')]: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '90%',
      },
    },
    emailConfText: {
      marginBottom: theme.spacing(1),
    },
    gameUrl: {
      wordBreak: 'break-word',
    },
    errorMsg: {
      padding: theme.spacing(2),
      textAlign: 'center',
    },
  })
);

interface GameLobbyProps {
  something?: boolean;
}

const GameLobby: React.FC<GameLobbyProps> = () => {
  const classes = useStyles();

  const { game, error, reserveSpot, lockSpot } = useLobbySystem();

  const spotReservedForMe = React.useMemo(() => {
    return game?.players.find((player) => player.reservedForMe);
  }, [game]);

  const spotLockedForMe = React.useMemo(() => {
    return game?.players.find((player) => player.lockedForMe);
  }, [game]);

  const getLabel = (player: LobbyGamePlayer) => {
    const playerReservation = player.reservedFor;

    if (!playerReservation) {
      return <span className={classes.availableSeat}>Vapaa</span>;
    }

    if (playerReservation.locked) {
      return <span>{player.name}</span>;
    }

    if (player.reservedForMe) {
      return (
        <span>{`Varattu sinulle ${format(
          new Date(playerReservation.expires),
          'HH:mm',
          {
            locale: fiLocale,
          }
        )} asti`}</span>
      );
    }

    if (playerReservation.expires > Date.now()) {
      return <span className={classes.bookedText}>Varattu</span>;
    }
  };

  const getWordList = (words?: string[]) => {
    if (!words) {
      logger.error('no words set for locked player');

      return null;
    }

    return (
      <>
        <Typography>Tässä ovat pelin sanasi:</Typography>
        <Typography>{words.join(' / ')}</Typography>
      </>
    );
  };

  const getGameUrl = (url?: string) => {
    if (!url) {
      logger.error('no inviteCode set for locked player');

      return null;
    }

    return (
      <>
        <Typography>Peliin pääset liittymään osoitteessa:</Typography>
        <Typography>{url}</Typography>
      </>
    );
  };

  const getContent = () => {
    if (!spotLockedForMe && !spotReservedForMe) {
      return (
        <Fab
          className={classes.reserveBtn}
          variant="extended"
          onClick={reserveSpot}
          color="primary"
        >
          Varaa paikka
        </Fab>
      );
    }

    if (spotLockedForMe) {
      const emailString = spotLockedForMe.email
        ? ` (${spotLockedForMe.email})`
        : '.';

      return (
        <Paper className={classes.registeredInfo}>
          <Typography variant="h5">
            {`Lähetimme pelin tiedot sähköpostiisi${emailString}`}
            {/** Lähetä uudestaan -nappi, vaihda sposti-toiminto? */}
          </Typography>
          <Typography className={classes.emailConfText}>
            Jos et saanut viestiä, kirjoita itsellesi alla olevat tiedot
            muistiin.
          </Typography>
          {getWordList(spotLockedForMe.privateData?.words)}
          {getGameUrl(spotLockedForMe.url)}
          {/** peruuta varaus-nappi? */}
        </Paper>
      );
    }

    return <LockReservationForm handleReserve={lockSpot} />;
  };

  return (
    <>
      <div className={classes.container}>
        {error && (
          <Typography variant="h5" color="error" className={classes.errorMsg}>
            {error}
          </Typography>
        )}
        {game ? (
          <>
            <Grid container spacing={4}>
              <Grid item xs={12} className={classes.centerAlign}>
                <Typography variant="h5">{`Tervetuloa pelaamaan ${capitalize(
                  game.type
                )}a!`}</Typography>
              </Grid>
              <Grid item md={6} xs={12} className={classes.centerAlign}>
                <div>
                  <Typography>{`Peli alkaa ${format(
                    new Date(game.startTime),
                    'd. MMMM HH:mm',
                    {
                      locale: fiLocale,
                    }
                  )}`}</Typography>
                  {game.price !== 0 && (
                    <Typography>{`Pelin hinta on ${game.price} €`}</Typography>
                  )}
                  <Typography>{`Peli-illan järjestää ${game.hostName}`}</Typography>
                </div>
              </Grid>

              <Grid item md={6} xs={12} className={classes.centerAlign}>
                <div>
                  <Typography>Ilmoittautuneet pelaajat:</Typography>
                  {game.players.map((player, index) => {
                    return (
                      <Typography key={index}>
                        <span>{`${index + 1}. `}</span>

                        {getLabel(player)}
                      </Typography>
                    );
                  })}
                </div>
              </Grid>
              <Grid item xs={12} className={classes.centerAlign}>
                {getContent()}
              </Grid>
            </Grid>
            <Paper className={classes.gameRules}>
              <Typography>
                <HelpOutlineIcon></HelpOutlineIcon>
                Kotitonnissa saat kolme sanaa, joihin kaikkiin sinun tulee
                keksiä vihjeet. Mitä harvempi pelaaja arvaa sanan vihjeen
                perusteella, sitä enemmän pisteitä saat.Vältä antamasta
                sisäpiirivihjeitä, jotta kaikkien on mahdollista tietää oikea
                vastaus.
              </Typography>
              <div className={classes.pointsExplained}>
                <div>
                  <Typography variant="body2">Kolme oikein</Typography>
                  <Typography variant="body2">+10</Typography>
                </div>
                <div>
                  <Typography variant="body2">Kaksi oikein</Typography>
                  <Typography variant="body2">+30</Typography>
                </div>
                <div>
                  <Typography variant="body2">Yksi oikein</Typography>
                  <Typography variant="body2">+100</Typography>
                </div>
                <div>
                  <Typography variant="body2">
                    Nolla tai kaikki oikein
                  </Typography>
                  <Typography variant="body2">-50</Typography>
                </div>
              </div>
            </Paper>

            <References />
          </>
        ) : (
          !error?.startsWith('Ilmoittautuminen on päättynyt') && ( // not showing spinner if lobby is no longer open
            <Loader msg={'Ladataan...'} spinner />
          )
        )}
      </div>
      <Footer />
    </>
  );
};

export default GameLobby;
