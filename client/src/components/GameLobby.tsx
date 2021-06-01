import { Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { format } from 'date-fns';
import fiLocale from 'date-fns/locale/fi';

import enLocale from 'date-fns/locale/en-US';
import { capitalize } from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { getSpectatorUrl } from '../helpers/games';
import useLobbySystem from '../hooks/useLobbySystem';
import { LobbyGamePlayer } from '../types';
import KotitonniLobbyInfo from './KotitonniLobbyInfo';
import KotitonniPointsInfo from './KotitonniPointsInfo';
import Loader from './Loader';
import LobbyContent from './LobbyContent';
import References from './References';
import ReservationConfirmedDialog from './ReservationConfirmedDialog';

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

    availableSeat: {
      color: 'rgb(104 122 106)',
    },
    bookedText: {
      color: theme.palette.error.main,
    },
    errorMsg: {
      padding: theme.spacing(2),
      textAlign: 'center',
    },
  })
);

const GameLobby: React.FC = () => {
  const classes = useStyles();

  const { t, i18n } = useTranslation();

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
      return <span className={classes.availableSeat}>{t('common.open')}</span>;
    }

    if (playerReservation.locked) {
      return <span>{player.name}</span>;
    }

    if (player.reservedForMe) {
      const timeString = format(new Date(playerReservation.expires), 'HH:mm', {
        locale: i18n.language === 'en' ? enLocale : fiLocale,
      });

      return <span>{t('lobby.reservedForYou', { time: timeString })}</span>;
    }

    if (playerReservation.expires > Date.now()) {
      return <span className={classes.bookedText}>{t('common.reserved')}</span>;
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

          <KotitonniLobbyInfo />
          <KotitonniPointsInfo />
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
