import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';

import { Typography, FormControl, MenuItem, Select } from '@material-ui/core';

import shortid from 'shortid';
import wordService from '../../services/words';

import DateFnsUtils from '@date-io/date-fns';
import fiLocale from 'date-fns/locale/fi';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';

import { Formik } from 'formik';

import { useHistory } from 'react-router-dom';

import RenderForm from './RenderForm';
import { useDispatch } from 'react-redux';
import { addGame } from '../../reducers/games.reducer';
import { GameType, GameStatus, KotitonniPlayer } from '../../types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    actionsContainer: {
      marginBottom: theme.spacing(2),
    },
    resetContainer: {
      padding: theme.spacing(3),
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

const getSteps = () => {
  return ['Ajankohta', 'Pelimuoto', 'Hinta'];
};

const NewGameB: React.FC = () => {
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

  const gameForm = () => {
    if (!players || !gameType) {
      return <div>Ladataan...</div>;
    }
    return (
      <>
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
              <RenderForm
                handleReturn={handleReturn}
                formikProps={formikProps}
              />
            )}
          </Formik>
        </MuiPickersUtilsProvider>
      </>
    );
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <Typography>Milloin haluat järjestää peli-illan?</Typography>
            {gameForm()}
          </>
        );
      case 1:
        return (
          <>
            <Typography>Valitse mitä pelataan</Typography>
            <Button
              className={classes.button}
              onClick={() => setGameType(GameType.KOTITONNI)}
            >
              Kotitonni
            </Button>
          </>
        );
      case 2:
        return (
          <>
            <Typography>Aseta peli-illalle hinta</Typography>
            <FormControl variant="standard">
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
          </>
        );

      default:
        return 'Unknown step';
    }
  };

  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const chooseType = () => (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              {getStepContent(index)}
              <div className={classes.actionsContainer}>
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.button}
                  >
                    Palaa
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    className={classes.button}
                  >
                    {activeStep === steps.length - 1 ? 'Valmis' : 'Seuraava'}
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <div className={classes.resetContainer}>
          <Typography>
            Jaa tämä linkki pelaajille, jotka haluat kutsua pelaamaan.
          </Typography>
          <Button onClick={handleReset} className={classes.button}>
            Nollaa
          </Button>
          <Button onClick={handleReturn} className={classes.button}>
            Dashboard
          </Button>
        </div>
      )}
    </div>
  );

  /** @TODO validate inputs with Yup ? */

  return <div>{chooseType()}</div>;
};

export default NewGameB;
