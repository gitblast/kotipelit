import React from 'react';

import References from './References';

import useLobbySystem from '../hooks/useLobbySystem';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  Fab,
  Typography,
  Grid,
  GridList,
  GridListTile,
  GridListTileBar,
  TextField,
} from '@material-ui/core';
import { LobbyGamePlayer } from '../types';
import Loader from './Loader';
import { capitalize } from 'lodash';
import { format } from 'date-fns';
import fiLocale from 'date-fns/locale/fi';
import userImg from '../assets/images/user.png';
import logger from '../utils/logger';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      margin: theme.spacing(2),
      padding: theme.spacing(2),
    },
    infoBox: {
      marginTop: theme.spacing(2),
      marginLeft: theme.spacing(2),
    },
    // flexin: {
    //   display: 'flex',
    //   alignItems: 'center',
    //   justifyContent: 'space-evenly',
    // },

    reserveBtn: {
      padding: theme.spacing(4),
      margin: theme.spacing(2),
    },
    gridTile: {
      backgroundColor: 'grey',
      border: 'solid white',
    },
    titleBar: {
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      height: 40,
    },
    freeSlotText: {
      color: 'white',
    },
    bookedText: {
      color: 'red',
    },
    sectionB: {
      marginTop: 150,
      textAlign: 'center',
      color: 'grey',
      [theme.breakpoints.down('xs')]: {
        marginTop: 30,
      },
    },
    image: {
      width: '100%',
      height: 'auto',
    },
    padded: {
      padding: theme.spacing(2),
    },
  })
);

interface LockReservationFormProps {
  handleClick: (displayName: string) => void;
}

const LockReservationForm: React.FC<LockReservationFormProps> = ({
  handleClick,
}) => {
  const classes = useStyles();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');

  return (
    <div className={classes.padded}>
      <div className={classes.padded}>
        <TextField
          value={name}
          onChange={({ target }) => setName(target.value)}
          label="Nimi"
        />
      </div>
      <div className={classes.padded}>
        <TextField
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          label="Sähköpostiosoite"
        />
      </div>
      <Fab
        className={classes.reserveBtn}
        color="primary"
        variant="extended"
        onClick={() => handleClick(name)}
        disabled={!name}
      >
        <Typography>Lukitse varaus</Typography>
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
        <span className={classes.freeSlotText}>{`Varattu sinulle ${format(
          new Date(player.expires),
          'HH:mm',
          {
            locale: fiLocale,
          }
        )} asti`}</span>
      );
    }

    if (player.expires && player.expires > Date.now()) {
      return <span className={classes.bookedText}>Varattu</span>;
    }

    return <span className={classes.freeSlotText}>Vapaa</span>;
  };

  const getWordList = (words?: string[]) => {
    if (!words) {
      logger.error('no words set for locked player');

      return null;
    }

    return (
      <>
        <Typography variant="h5">Sanasi:</Typography>
        <Typography variant="h6">{words.join(' / ')}</Typography>
        <Typography>
          Tehtävänäsi on miettiä sanoillesi lyhyet vihjeet. Eniten pisteitä saat
          kun vain yksi kanssapelaaja arvaa sanan.
        </Typography>
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
        <Typography variant="h6">
          Peliin pääset liittymään osoitteessa:
        </Typography>
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
        >
          <Typography>Varaa paikka</Typography>
        </Fab>
      );
    }

    if (spotLockedForMe) {
      return (
        <div>
          <Typography variant="h4">Paikan varaus onnistui!</Typography>
          {getWordList(spotLockedForMe.words)}
          {getGameUrl(spotLockedForMe.url)}
        </div>
      );
    }

    return <LockReservationForm handleClick={lockSpot} />;
  };

  return (
    <>
      {error && <Typography color="error">{error}</Typography>}
      {game ? (
        <>
          <Grid container spacing={3}>
            <Grid item sm={1}></Grid>
            <Grid item xs={12} sm={5}>
              <Typography variant="h4">{`Tervetuloa pelaamaan ${capitalize(
                game.type
              )}a!`}</Typography>
              <div className={classes.infoBox}>
                <Typography variant="h6">{`Peli alkaa ${format(
                  new Date(game.startTime),
                  'd. MMMM HH:mm',
                  {
                    locale: fiLocale,
                  }
                )}`}</Typography>
                {game.price !== 0 && (
                  <Typography variant="h6">{`Pelin hinta on ${game.price} €`}</Typography>
                )}
                <Typography variant="h6">{`Peli-illan järjestää ${game.hostName}`}</Typography>
                {getContent()}
              </div>
            </Grid>

            <Grid item xs={12} sm={5}>
              <GridList cellHeight={160} cols={3}>
                {game.players.map((player, index) => {
                  return (
                    <GridListTile
                      key={index}
                      cols={1}
                      className={classes.gridTile}
                    >
                      <img className={classes.image} src={userImg} alt="user" />
                      {/* <span>{`${index + 1}. `}</span> */}

                      <GridListTileBar
                        className={classes.titleBar}
                        subtitle={getLabel(player)}
                      />
                    </GridListTile>
                  );
                })}
              </GridList>
            </Grid>
            <Grid item sm={1}></Grid>
          </Grid>
          <References />
        </>
      ) : (
        <Loader msg={'Ladataan...'} spinner />
      )}
    </>
  );
};

export default GameLobby;
