import React from 'react';

import { v4 as uuidv4 } from 'uuid';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import gameService from '../services/games';
import {
  Fab,
  Paper,
  Typography,
  Grid,
  GridList,
  GridListTile,
  GridListTileBar,
} from '@material-ui/core';
import { LobbyGame, LobbyGamePlayer } from '../types';
import logger from '../utils/logger';
import Loader from './Loader';
import { capitalize } from 'lodash';
import { format } from 'date-fns';
import fiLocale from 'date-fns/locale/fi';
import userImg from '../assets/images/user.png';

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
      color: 'white',
      backgroundColor: 'rgb(78 156 63)',
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
  })
);

interface ParamTypes {
  username: string;
  gameID: string;
}

interface GameLobbyProps {
  something?: boolean;
}

const GameLobby: React.FC<GameLobbyProps> = () => {
  const classes = useStyles();
  const { username, gameID } = useParams<ParamTypes>();
  const [reservationId, setReservationId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [game, setGame] = React.useState<LobbyGame | null>(null);

  React.useEffect(() => {
    const fetchGame = async (host: string, id: string) => {
      try {
        const fetchedGame = await gameService.getLobbyGame(host, id);

        logger.log('setting game', fetchedGame);

        setGame(fetchedGame);
      } catch (e) {
        setError('Peliä ei löytynyt, tarkista osoite!');
      }
    };

    if (!game && gameID && username) {
      fetchGame(username, gameID);
    }
  }, [gameID, game, username]);

  React.useEffect(() => {
    setReservationId(uuidv4());
  }, []);

  const reserveSpot = async () => {
    if (!reservationId || !gameID || !game) {
      return;
    }

    try {
      const reservationData = await gameService.reserveSpotForGame(
        reservationId,
        gameID
      );

      console.log(reservationData);

      const newGame = {
        ...game,
        players: game.players.map((player) => {
          return player && player.id === reservationData.playerId
            ? {
                ...player,
                expires: reservationData.expiresAt,
                reservedForMe: true,
              }
            : player;
        }),
      };

      logger.log('setting new game', newGame);

      setGame(newGame);
    } catch (e) {
      setError('Peliin liittyminen epäonnistui');
    }
  };

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

  return (
    <Paper elevation={0} className={classes.container}>
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
                <Fab
                  className={classes.reserveBtn}
                  variant="extended"
                  onClick={reserveSpot}
                  disabled={!reservationId || !gameID}
                >
                  <Typography>Varaa paikka</Typography>
                </Fab>
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
          <Grid container className={classes.sectionB} spacing={5}>
            {/* Toistaa itseään, tee mahd. objekti jossa koottuja vihjeitä, vaihtele näkymää */}
            <Grid item sm={4}>
              <Typography variant="h6">
                &quot;Hautajaishuijaus, johon et halua sijoittaa.&quot;
              </Typography>
            </Grid>
            <Grid item sm={4}>
              <Typography variant="h6">
                &quot;Anthony Hopkinsin lemmikin oikeudellinen asema.&quot;
              </Typography>
            </Grid>
            <Grid item sm={4}>
              <Typography variant="h6">
                &quot;Löytyy tähtimerkeistä ja Espanjasta.&quot;
              </Typography>
            </Grid>
          </Grid>
        </>
      ) : (
        <Loader msg={'Ladataan...'} spinner />
      )}
    </Paper>
  );
};

export default GameLobby;
