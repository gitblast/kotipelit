import { Grid, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { format } from 'date-fns';
import fiLocale from 'date-fns/locale/fi';
import { capitalize } from 'lodash';
import React from 'react';
import logoImg from '../assets/images/logo.png';
import useLobbySystem from '../hooks/useLobbySystem';
import { LobbyGamePlayer } from '../types';
import KotitonniRulesBanner from './KotitonniRulesBanner';
import Loader from './Loader';
import LobbyContent from './LobbyContent';
import References from './References';
import ReservationConfirmedDialog from './ReservationConfirmedDialog';

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

const GameLobby: React.FC = () => {
  const classes = useStyles();

  const [dialogOpen, setDialogOpen] = React.useState(false);

  const {
    game,
    error,
    reserveSpot,
    lockSpot,
    unlockedReservationData,
    lockedReservationData,
  } = useLobbySystem();

  React.useLayoutEffect(() => {
    if (lockedReservationData) {
      setDialogOpen(true);
    }
  }, [lockedReservationData]);

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

  return (
    <div className={classes.container}>
      {lockedReservationData && (
        <ReservationConfirmedDialog
          open={dialogOpen}
          handleClose={() => setDialogOpen(false)}
          lockedReservationData={lockedReservationData}
        />
      )}
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
              <LobbyContent
                handleReserve={reserveSpot}
                handleLock={lockSpot}
                unlockedReservationData={unlockedReservationData}
                lockedReservationData={lockedReservationData}
              />
            </Grid>
          </Grid>
          <KotitonniRulesBanner />

          <References />
        </>
      ) : (
        !error?.startsWith('Ilmoittautuminen on päättynyt') && ( // not showing spinner if lobby is no longer open
          <Loader msg={'Ladataan..'} spinner />
        )
      )}
    </div>
  );
};

export default GameLobby;
