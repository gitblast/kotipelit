import { Typography, Grid } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { format } from 'date-fns';
import fiLocale from 'date-fns/locale/fi';
import { capitalize } from 'lodash';
import React from 'react';
import useLobbySystem from '../hooks/useLobbySystem';
import { LobbyGamePlayer } from '../types';
import Loader from './Loader';
import LobbyContent from './LobbyContent';
import References from './References';
import ReservationConfirmedDialog from './ReservationConfirmedDialog';
import { getSpectatorUrl } from '../helpers/games';
import VimeoMedia from './VimeoMedia';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginTop: theme.spacing(4),
      marginLeft: theme.spacing(4),
      marginRight: theme.spacing(4),
      '& > * + *': {
        marginTop: theme.spacing(8),
      },
      [theme.breakpoints.down('xs')]: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        '& > * + *': {
          marginTop: theme.spacing(4),
        },
      },
    },
    centerAlign: {
      marginTop: theme.spacing(1),
      display: 'flex',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
      },
    },
    highlighted: {
      color: theme.palette.success.main,
    },
    invitationText: {
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        marginTop: theme.spacing(3),
      },
    },
    gameInfo: {
      marginTop: theme.spacing(2),
    },
    gameKotitonni: {
      fontFamily: 'BeautySchoolDropoutII',
      textTransform: 'uppercase',
      fontSize: '2.5rem',
    },
    registeredPlayers: {
      [theme.breakpoints.down('xs')]: {
        marginTop: theme.spacing(3),
      },
    },
    kotitonniSection: {
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    availableSeat: {
      color: 'rgb(104 122 106)',
    },
    bookedText: {
      color: theme.palette.error.main,
    },
    ruleComment: {
      textAlign: 'center',
    },
    // Points explanation section
    pointsRow: {
      display: 'flex',
      justifyContent: 'space-around',
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
      },
    },
    pointBlock: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    points: {
      fontFamily: 'BeautySchoolDropoutII',
      fontSize: '3rem',
      color: 'rgb(41 174 170)',
    },
    pointsWrong: {
      color: 'rgb(171 34 186)',
    },
    errorMsg: {
      padding: theme.spacing(2),
      textAlign: 'center',
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
      {lockedReservationData && game && (
        <ReservationConfirmedDialog
          open={dialogOpen}
          handleClose={() => setDialogOpen(false)}
          lockedReservationData={lockedReservationData}
          spectatorUrl={
            game.allowedSpectators
              ? getSpectatorUrl(game.id, game.hostName)
              : undefined
          }
        />
      )}
      {error && (
        <Typography variant="h5" color="error" className={classes.errorMsg}>
          {error}
        </Typography>
      )}
      {game ? (
        <>
          <div className={classes.centerAlign}>
            <div className={classes.invitationText}>
              <Typography variant="h1" color="initial">
                <span
                  className={classes.highlighted}
                >{`${game.hostName} `}</span>
                kutsui sinut pelaamaan!
              </Typography>
              <div className={classes.gameInfo}>
                <Typography
                  variant="h2"
                  color="initial"
                  className={classes.gameKotitonni}
                >
                  {` ${capitalize(game.type)}`}
                </Typography>
                <Typography variant="h2">
                  {' '}
                  {`${format(new Date(game.startTime), 'd. MMMM HH:mm', {
                    locale: fiLocale,
                  })}`}
                </Typography>
                {game.price !== 0 && (
                  <Typography variant="h2">
                    Pelin hinta on <span>{`${game.price} €`}</span>
                  </Typography>
                )}
                <LobbyContent
                  handleReserve={reserveSpot}
                  handleLock={lockSpot}
                  unlockedReservationData={unlockedReservationData}
                  lockedReservationData={lockedReservationData}
                />
              </div>
            </div>
            <div className={classes.registeredPlayers}>
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
          </div>

          <Grid container spacing={2} className={classes.kotitonniSection}>
            <Grid item md={1}></Grid>
            <Grid item md={5} xs={12}>
              <Typography
                variant="body1"
                color="initial"
                className={classes.ruleComment}
              >
                Kotitonni on hauska seurapeli, jossa sanallinen luovuus pääsee
                valloilleen.
              </Typography>
            </Grid>
            <Grid item md={5} xs={12}>
              <VimeoMedia />
            </Grid>
            <Grid item md={1}></Grid>
          </Grid>

          <Typography
            variant="body1"
            color="initial"
            className={classes.ruleComment}
          >
            Saat ilmottautuessasi kolme sanaa, joihin sinun tulee keksiä
            vihjeet.
          </Typography>

          <Typography
            variant="body1"
            color="initial"
            className={classes.ruleComment}
          >
            Tavoitteena, että vain yksi kanssapelaaja arvaa oikean sanan!
          </Typography>
          <div className={classes.pointsRow}>
            <div className={classes.pointBlock}>
              <Typography variant="body1" color="initial">
                1 oikein:
              </Typography>
              <Typography
                variant="body1"
                color="initial"
                className={classes.points}
              >
                100
              </Typography>
            </div>
            <div className={classes.pointBlock}>
              <Typography variant="body1" color="initial">
                2 oikein:
              </Typography>
              <Typography
                variant="body1"
                color="initial"
                className={classes.points}
              >
                30
              </Typography>
            </div>
            <div className={classes.pointBlock}>
              <Typography variant="body1" color="initial">
                3 oikein:
              </Typography>
              <Typography
                variant="body1"
                color="initial"
                className={classes.points}
              >
                10
              </Typography>
            </div>
            <div className={classes.pointBlock}>
              <Typography variant="body1" color="initial">
                0 tai kaikki oikein:
              </Typography>
              <Typography
                variant="body1"
                color="initial"
                className={`${classes.points} ${classes.pointsWrong}`}
              >
                -50
              </Typography>
            </div>
          </div>
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
