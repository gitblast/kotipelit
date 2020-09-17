import React from 'react';

import shortid from 'shortid';
import wordService from '../../services/words';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { Typography, Divider, Fab } from '@material-ui/core';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import fiLocale from 'date-fns/locale/fi';

import { Formik } from 'formik';

import { useHistory } from 'react-router-dom';

import RenderForm from './RenderForm';
import { useDispatch } from 'react-redux';
import { addGame } from '../../reducers/games.reducer';
import { GameType, GameStatus, KotitonniPlayer } from '../../types';
import { green } from '@material-ui/core/colors';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  const [gameType, setGameType] = React.useState<null | GameType>(null);
  const [players, setPlayers] = React.useState<null | KotitonniPlayer[]>(null);

  React.useEffect(() => {
    const init = async () => {
      const initialPlayers = await initializePlayers(5, 3);
      setPlayers(initialPlayers);
    };

    try {
      init();
    } catch (error) {
      console.error('TODO: handle errors');
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
    <div>
      <Typography variant="h6">
        1. Aseta pelille hinta (dropdown box hinnalle)
      </Typography>
      <Typography variant="h6">2. Valitse peli</Typography>
      <div className={classes.gameRow}>
        <Fab
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
          se kestää noin tunnin.
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
      </div>
    </div>
  );

  const gameForm = () => {
    if (!players) {
      return <div>Ladataan...</div>;
    }

    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={fiLocale}>
        <Formik
          initialValues={{
            startTime: new Date(),
            type: GameType.KOTITONNI,
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
