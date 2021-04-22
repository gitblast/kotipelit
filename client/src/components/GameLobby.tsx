import { Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { format } from 'date-fns';
import fiLocale from 'date-fns/locale/fi';
import { capitalize } from 'lodash';
import React from 'react';
import logoImg from '../assets/images/logoTransparent.png';
import useLobbySystem from '../hooks/useLobbySystem';
import { LobbyGamePlayer } from '../types';
import KotitonniRulesBanner from './KotitonniRulesBanner';
import Loader from './Loader';
import LobbyContent from './LobbyContent';
import References from './References';
import ReservationConfirmedDialog from './ReservationConfirmedDialog';
import { getSpectatorUrl } from '../helpers/games';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      [theme.breakpoints.down('xs')]: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
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
      color: theme.palette.info.main,
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        marginTop: theme.spacing(3),
      },
    },
    gameInfo: {
      marginTop: theme.spacing(2),
    },
    videocallInfo: {
      margin: theme.spacing(3),
      textAlign: 'center',
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
      height: 325,
      opacity: 0.5,
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
            <div>
              <img
                src={logoImg}
                alt="background"
                className={classes.showcaseImage}
              />
            </div>
            <div className={classes.invitationText}>
              <Typography variant="h3" color="initial">
                <span
                  className={classes.highlighted}
                >{`${game.hostName} `}</span>
                kutsui sinut pelaamaan!
              </Typography>
              <div className={classes.gameInfo}>
                <Typography variant="body1" color="initial">
                  {` ${capitalize(game.type)}`}
                </Typography>
                <Typography variant="body1">
                  {' '}
                  {`${format(new Date(game.startTime), 'd. MMMM HH:mm', {
                    locale: fiLocale,
                  })}`}
                </Typography>
                {game.price !== 0 && (
                  <Typography variant="body1">
                    Pelin hinta on{' '}
                    <span
                      className={classes.highlighted}
                    >{`${game.price} €`}</span>
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
          </div>
          <div className={classes.centerAlign}>
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

            <div className={classes.videocallInfo}>
              <Typography variant="body1" color="initial">
                Peli pelataan Kotipelien pelaamiseen <br></br> kustomoidulla
                videopuhelualustalla
              </Typography>
            </div>
          </div>
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
