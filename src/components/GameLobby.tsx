import React from 'react';

import References from './References';
import LockReservationForm from './LockReservationForm';

import useLobbySystem from '../hooks/useLobbySystem';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Button, Typography, Grid, Paper } from '@material-ui/core';
import { LobbyGamePlayer } from '../types';
import Loader from './Loader';
import { capitalize } from 'lodash';
import { format } from 'date-fns';
import fiLocale from 'date-fns/locale/fi';
import logger from '../utils/logger';

import logoImg from '../assets/images/logo.png';

import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      color: 'rgb(0 225 217)',
      [theme.breakpoints.down('xs')]: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
      },
    },
    welcomeMsg: {
      textAlign: 'center',
    },
    centerAlign: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: theme.palette.primary.light,
    },
    availableSeat: {
      color: 'rgb(104 122 106)',
    },
    bookedText: {
      color: theme.palette.error.main,
    },
    gameRules: {
      padding: theme.spacing(3),
      marginTop: theme.spacing(6),
      marginLeft: theme.spacing(6),
      marginRight: theme.spacing(6),
      color: theme.palette.primary.light,
      // Ligth version of background
      backgroundColor: 'rgb(15 47 60)',
      // Create a palette variable
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
      // Ligth version of background
      backgroundColor: 'rgb(15 47 60)',
      color: theme.palette.primary.light,
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
    showcaseImage: {
      height: 347,
      [theme.breakpoints.down('xs')]: {
        maxHeight: 200,
      },
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
        <Typography variant="caption">{url}</Typography>
      </>
    );
  };

  const getContent = () => {
    if (!spotLockedForMe && !spotReservedForMe) {
      return (
        <Button onClick={reserveSpot} color="secondary">
          Varaa paikka
        </Button>
      );
    }

    if (spotLockedForMe) {
      const emailString = spotLockedForMe.email
        ? ` (${spotLockedForMe.email})`
        : '.';

      return (
        <Paper className={classes.registeredInfo}>
          <Typography variant="body1" color="primary">
            {`Lähetimme pelin tiedot sähköpostiisi${emailString}`}
            {/** Lähetä uudestaan -nappi, vaihda sposti-toiminto? */}
          </Typography>
          <Typography variant="body2" className={classes.emailConfText}>
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
              <Grid item md></Grid>
              <Grid item md={5} sm={12} xs={12}>
                <div className={classes.centerAlign}>
                  <img
                    src={logoImg}
                    alt="background"
                    className={classes.showcaseImage}
                  />
                </div>
              </Grid>
              <Grid item md={5} sm={12} xs={12} className={classes.centerAlign}>
                <div className={classes.welcomeMsg}>
                  <Typography
                    variant="h3"
                    color="primary"
                  >{`Tervetuloa pelaamaan ${capitalize(
                    game.type
                  )}a!`}</Typography>
                </div>
              </Grid>
              <Grid item md></Grid>
              <Grid item md={6} xs={12} className={classes.centerAlign}>
                <div>
                  <Typography variant="h5">{`Peli alkaa ${format(
                    new Date(game.startTime),
                    'd. MMMM HH:mm',
                    {
                      locale: fiLocale,
                    }
                  )}`}</Typography>
                  {game.price !== 0 && (
                    <Typography variant="h5">{`Pelin hinta on ${game.price} €`}</Typography>
                  )}
                  <Typography variant="h5">
                    {`Peli-illan järjestää ${game.hostName}`}
                  </Typography>
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
              <Typography variant="body1">
                <HelpOutlineIcon></HelpOutlineIcon>
                Kotitonnissa saat kolme sanaa, joihin sinun tulee keksiä
                vihjeet. Mitä harvempi pelaaja arvaa sanan, sitä enemmän
                pisteitä saat.
              </Typography>
              <Typography variant="body1" color="initial">
                Vältä antamasta sisäpiirivihjeitä, jotta kaikkien on mahdollista
                tietää oikea vastaus.
              </Typography>
              <div className={classes.pointsExplained}>
                <div>
                  <Typography variant="body2">Yksi oikein</Typography>
                  <Typography variant="body2">+100</Typography>
                </div>
                <div>
                  <Typography variant="body2">Kaksi oikein</Typography>
                  <Typography variant="body2">+30</Typography>
                </div>
                <div>
                  <Typography variant="body2">Kolme oikein</Typography>
                  <Typography variant="body2">+10</Typography>
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
            <Loader msg={'Ladataan..'} spinner />
          )
        )}
      </div>
    </>
  );
};

export default GameLobby;
