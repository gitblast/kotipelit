import React from 'react';

import shortid from 'shortid';
import wordService from '../../services/words';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import {
  Typography,
  Divider,
  FormControl,
  MenuItem,
  Select,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
} from '@material-ui/core';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import fiLocale from 'date-fns/locale/fi';

import { Formik } from 'formik';

import { useHistory } from 'react-router-dom';

import RenderForm from './RenderForm';
import { useDispatch } from 'react-redux';
import { addGame } from '../../reducers/games.reducer';
import { GameType, GameStatus, KotitonniPlayer } from '../../types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      margin: theme.spacing(2),
    },
    marginRight: {
      marginRight: theme.spacing(2),
    },
    gameBtn: {
      padding: 50,
      margin: 10,
    },
    gameRow: {
      display: 'flex',
      alignItems: 'center',
    },
    unactiveGame: {
      color: 'grey',
    },
    gameCard: {
      maxWidth: 280,
    },
    cardBottom: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
    },
  })
);

/**
 * Generates initial player objects to be used in state
 * @param playerCount - number of players
 * @param wordsPerPlayer - words per player
 * @return {Promise} - Array of player objects with unique, randow words each
 */
export const initializePlayers = async (
  playerCount: number,
  wordsPerPlayer: number
): Promise<KotitonniPlayer[]> => {
  const players = [];

  const randomWords = await wordService.getMany(playerCount * wordsPerPlayer);
  for (let i = 1; i <= playerCount; i++) {
    const words: string[] = [];

    for (let j = 0; j < wordsPerPlayer; j++) {
      const word = randomWords.pop();

      if (word) words.push(word);
    }

    players.push({
      id: shortid.generate(),
      name: `Pelaaja ${i}`,
      words,
      points: 0,
      online: false,
    });
  }

  return players;
};

const NewGame: React.FC = () => {
  const [gameType, setGameType] = React.useState<GameType | null>(null);
  const [price, setPrice] = React.useState<number>(2);
  const [players, setPlayers] = React.useState<null | KotitonniPlayer[]>(null);

  React.useEffect(() => {
    const init = async () => {
      const initialPlayers = await initializePlayers(5, 3);
      setPlayers(initialPlayers);
    };

    try {
      init();
    } catch (error) {
      console.error('error initializing players for new game:', error.message);
    }
  }, []);

  const classes = useStyles();

  const dispatch = useDispatch();

  // react router
  const history = useHistory();

  /**
   * Redirects back to host main page
   */
  const handleReturn = (): void => {
    history.goBack();
  };

  const chooseType = () => (
    <div className={classes.container}>
      <div className={classes.gameRow}>
        <Typography variant="h6" className={classes.marginRight}>
          1. Pelin hinta per pelaaja
        </Typography>
        <FormControl className={classes.marginRight} variant="standard">
          <Select
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          >
            <MenuItem value={0}>0€</MenuItem>
            <MenuItem value={2}>2€</MenuItem>
            <MenuItem value={3}>3€</MenuItem>
            <MenuItem value={4}>4€</MenuItem>
            <MenuItem value={5}>5€</MenuItem>
            <MenuItem value={6}>6€</MenuItem>
            <MenuItem value={7}>7€</MenuItem>
            <MenuItem value={8}>8€</MenuItem>
            <MenuItem value={9}>9€</MenuItem>
            <MenuItem value={10}>10€</MenuItem>
          </Select>
        </FormControl>
        <Typography variant="body2">
          Saat 80% pelin tuotosta itsellesi.
        </Typography>
      </div>
      <Typography variant="h6">2. Valitse peli</Typography>
      <div className={classes.gameRow}>
        <Card
          className={classes.gameCard}
          onClick={() => setGameType(GameType.KOTITONNI)}
          elevation={3}
        >
          <CardActionArea>
            <CardMedia
              component="img"
              alt="Kotitonni"
              height="200"
              image="/images/Kotitonni.png"
              title="Kotitonni"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Kotitonni
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Pelaajille lähetetään ennen peliä 3 sanaa, joihin he miettivät
                vihjeet. Pelaajat kirjoittavat sinulle vastauksensa. Vastausaika
                on 90 sekuntia.
              </Typography>
              <CardContent>
                <div className={classes.cardBottom}>
                  <Typography variant="body2" component="p">
                    • 5 pelaajaa
                  </Typography>
                  <Typography variant="body2" component="p">
                    • 45-60min
                  </Typography>
                </div>
              </CardContent>
            </CardContent>
          </CardActionArea>
        </Card>
      </div>
      {/* <Fab
          onClick={() => setGameType(GameType.KOTITONNI)}
          variant="extended"
          className={classes.gameBtn}
          color="secondary"
        >
          Kotitonni
        </Fab>
        <Typography>
          Kotitonnissa arvuutellaan kanssapelaajien sanoja vihjeiden avulla.
          Jokainen pelaajista antaa vuorollaan vihjeen hänelle ennalta
          lähetettyyn sanaan. Pelaajilla on 90 sekuntia aikaa keksiä oikea sana.
          Vihjeen tulisi olla sellainen, että vähintään yksi arvaa mutta ei
          liian helppo, jotta kaikki ei arvaa. Peli pelataan 5:llä pelaajalla ja
          kestää noin tunnin.
        </Typography>
      </div>
      <div className={classes.gameRow}>
        <Fab disabled variant="extended" className={classes.gameBtn}>
          Liars Poker
        </Fab>
        <Typography className={classes.unactiveGame}>
          Liars Poker- pelissä jokainen pelaaja saa numerosarjan. Ensimmäinen
          pelaaja aloittaa sanomalla esimerkiksi kolme kolmosta. Seuraavan
          pelaajan täytyy joko epäillä tai "ylittää" tämä sanomalla minimissään
          kolme nelosta. Jos pelaaja epäilee ja kaikkien numeroista ei yhteensä
          muodostu vähintään kolmea kolmosta, menettää ensimmäinen pelaaja
          pisteen. Peliä voi pelata 2 - 6 pelaajaa.
        </Typography>
      </div>
      <div className={classes.gameRow}>
        <Fab disabled variant="extended" className={classes.gameBtn}>
          Kolmas peli
        </Fab>
        <Typography>
          Voit ehdottaa peliä, jota voisi olla videopuhelun välityksellä hauska
          pelata. Ehdotukset osoitteeseen info@kotipelit.com
        </Typography>
      </div> */}
    </div>
  );

  const gameForm = () => {
    if (!players || !gameType) {
      return <div>Ladataan...</div>;
    }

    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={fiLocale}>
        <Formik
          initialValues={{
            startTime: new Date(),
            type: gameType,
            price,
            players,
            status: GameStatus.UPCOMING,
            rounds: 3,
            hostOnline: false,
          }}
          onSubmit={(values) => {
            dispatch(addGame(values));
            handleReturn();
          }}
        >
          {(formikProps) => (
            <RenderForm handleReturn={handleReturn} formikProps={formikProps} />
          )}
        </Formik>
      </MuiPickersUtilsProvider>
    );
  };

  /** @TODO validate inputs with Yup ? */

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Luo uusi peli
      </Typography>
      <Divider />
      <Typography variant="body2" gutterBottom>
        1. Aseta hinta -- 2. Valitse peli -- 3. Aseta aika - - 4. Syötä pelaajat
      </Typography>
      <Divider />
      {gameType ? gameForm() : chooseType()}
    </div>
  );
};

export default NewGame;
