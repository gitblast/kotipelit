import React from 'react';

import References from './References';

import useLobbySystem from '../hooks/useLobbySystem';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Fab, Typography, Grid, TextField, Paper } from '@material-ui/core';
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
    },
    seatLock: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      [theme.breakpoints.down('xs')]: {
        flexWrap: 'wrap',
      },
    },
    availableSeat: {
      color: 'rgb(104 122 106)',
    },
    reserveBtn: {
      padding: theme.spacing(4),
      margin: theme.spacing(2),
    },
    lockBtn: {
      margin: theme.spacing(4),
    },
    bookedText: {
      color: 'red',
    },
    gameRules: {
      padding: theme.spacing(4),
      marginTop: theme.spacing(6),
      marginLeft: theme.spacing(6),
      marginRight: theme.spacing(6),
      backgroundColor: 'rgb(197 226 210)',
      [theme.breakpoints.down('xs')]: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
      },
    },
    registeredInfo: {
      padding: theme.spacing(2),
    },
    emailConfText: {
      marginBottom: theme.spacing(1),
    },
  })
);

interface LockReservationFormProps {
  handleClick: (displayName: string, email: string) => void;
}

const LockReservationForm: React.FC<LockReservationFormProps> = ({
  handleClick,
}) => {
  const classes = useStyles();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');

  return (
    <div className={classes.seatLock}>
      <div>
        <div>
          <TextField
            value={name}
            onChange={({ target }) => setName(target.value)}
            label="Nimi"
          />
        </div>
        <div>
          <TextField
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Sähköpostiosoite"
          />
          <Typography variant="body1">
            *Saat pelin tiedot sähköpostiisi. Tietosi poistuu järjestelmästä
            kolmen päivän kuluessa.
          </Typography>
        </div>
      </div>
      <Fab
        className={classes.lockBtn}
        color="primary"
        variant="extended"
        onClick={() => handleClick(name, email)}
        disabled={!name}
      >
        <Typography>Lukitse </Typography>
      </Fab>
    </div>
  );
};

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
    if (player.locked) {
      return <span>{player.name}</span>;
    }

    if (player.reservedForMe && player.expires) {
      return (
        <span>{`Varattu sinulle ${format(new Date(player.expires), 'HH:mm', {
          locale: fiLocale,
        })} asti`}</span>
      );
    }

    if (player.expires && player.expires > Date.now()) {
      return <span className={classes.bookedText}>Varattu</span>;
    }

    return <span className={classes.availableSeat}>Vapaa</span>;
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
      return (
        <div className={classes.registeredInfo}>
          <Typography className={classes.emailConfText}>
            Lähetimme alla olevat tiedot sähköpostiisi.
          </Typography>
          {getWordList(spotLockedForMe.words)}
          {getGameUrl(spotLockedForMe.url)}
        </div>
      );
    }

    return <LockReservationForm handleClick={lockSpot} />;
  };

  return (
    <>
      <div className={classes.container}>
        {error && <Typography color="error">{error}</Typography>}
        {game ? (
          <>
            <Grid container spacing={4}>
              <Grid item xs={12} className={classes.centerAlign}>
                <Typography variant="h4">{`Tervetuloa pelaamaan ${capitalize(
                  game.type
                )}a!`}</Typography>
              </Grid>
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
                  <Typography variant="h5">{`Peli-illan järjestää ${game.hostName}`}</Typography>
                  {getContent()}
                </div>
              </Grid>

              <Grid item md={6} xs={12} className={classes.centerAlign}>
                <div>
                  <Typography variant="h5">
                    Ilmoittautuneet pelaajat:
                  </Typography>
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
            </Grid>
            <Paper className={classes.gameRules}>
              <Typography>
                <HelpOutlineIcon></HelpOutlineIcon>
                Kotitonnissa saat kolme sanaa, joihin sinun tulee keksiä
                vihjeet. Muut pelaajat arvuuttelevat oikeaa sanaa. Vain yhden
                pelaajan arvatessa oikein, saatte molemmat 100 pistettä. Kahden
                arvatessa oikein saa kukin 30 pistettä ja kolmen arvatessa saa
                pelaajat 10 pistettä. Mikäli kaikki tai ei kukaan arvaa, seuraa
                -50 pistettä. Vältä antamasta sisäpiirivihjeitä, jotta kaikkien
                on mahdollista tietää oikea vastaus.
              </Typography>
            </Paper>

            <References />
          </>
        ) : (
          <Loader msg={'Ladataan...'} spinner />
        )}
      </div>
      <Footer />
    </>
  );
};

export default GameLobby;
