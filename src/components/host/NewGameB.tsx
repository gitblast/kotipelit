import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';

import ChooseDate from './ChooseDate';
import ChooseGame from './ChooseGame';
import ChoosePrice from './ChoosePrice';

import { Typography } from '@material-ui/core';
import { initializePlayers } from '../../helpers/games';

import { useHistory } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { addGame } from '../../reducers/games.reducer';
import { GameType, GameStatus, KotitonniPlayer } from '../../types';
import logger from '../../utils/logger';

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

interface GameToAdd {
  startTime: Date;
  type: GameType;
  players: KotitonniPlayer[];
  status: GameStatus;
  rounds: number;
  hostOnline: boolean;
  price: number;
}

const NewGameB: React.FC = () => {
  const classes = useStyles();
  const [gameType, setGameType] = React.useState<GameType | null>(null);
  const [price, setPrice] = React.useState<number>(0);
  const [players, setPlayers] = React.useState<null | KotitonniPlayer[]>(null);
  const [startTime, setStartTime] = React.useState<null | Date>(new Date());
  const steps = React.useMemo(() => ['Ajankohta', 'Pelimuoto', 'Hinta'], []);
  const [activeStep, setActiveStep] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);

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

  const handleSelectGame = React.useCallback((selection: GameType) => {
    setGameType(selection);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }, []);

  const dispatch = useDispatch();

  // react router
  const history = useHistory();

  /**
   * Redirects back to host main page
   */
  const handleReturn = (): void => {
    history.goBack();
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <ChooseDate selected={startTime} setSelected={setStartTime} />;
      case 1:
        return <ChooseGame handleSelect={handleSelectGame} />;
      case 2:
        return <ChoosePrice price={price} setPrice={setPrice} />;

      default:
        return 'Unknown step';
    }
  };

  const saveGame = async (gameToAdd: GameToAdd) => {
    try {
      logger.log(`adding new game`, gameToAdd);

      const addedGame = dispatch(addGame(gameToAdd));

      console.log(addedGame);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      if (!players || !gameType || !startTime) {
        setError('Odottamaton virhe: jokin vaadituista arvoista puuttuu');
      } else {
        const gameToAdd = {
          players,
          price,
          startTime,
          type: gameType,
          status: GameStatus.UPCOMING,
          rounds: 3,
          hostOnline: false,
        };

        saveGame(gameToAdd);
      }
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
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
                  {activeStep !== 1 && ( // not shown when choosing game type
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      className={classes.button}
                    >
                      {activeStep === steps.length - 1 ? 'Valmis' : 'Seuraava'}
                    </Button>
                  )}
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
          <Button onClick={handleReturn} className={classes.button}>
            Dashboard
          </Button>
        </div>
      )}
    </div>
  );
};

export default NewGameB;
