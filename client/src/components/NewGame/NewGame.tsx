import {
  Button,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import { GameStatus, GameType } from '../../types';
import BottomContent from './BottomContent';
import ChooseDate from './ChooseDate';
import ChooseGame from './ChooseGame';
import ChoosePrice from './ChoosePrice';
import useNewKotitonniPlayers from './useNewKotitonniPlayers';
import useSaveGame from './useSaveGame';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      marginLeft: theme.spacing(4),
      color: 'rgb(0 225 217)',
    },
    headline: {
      display: 'flex',
      justifyContent: 'flex-start',
      marginTop: theme.spacing(4),
    },
    neonLight: {
      height: 3,
      background:
        'linear-gradient(to right, rgb(0 225 217), rgba(11, 43, 56, 1))',
      boxShadow: 'rgb(231 239 191) -23px 8px 44px',
      width: '11vw',
      alignSelf: 'center',
      marginTop: '6px',
    },
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
      padding: theme.spacing(1),
    },
    actionsContainer: {
      marginBottom: theme.spacing(2),
    },
    lobbyLink: {
      wordBreak: 'break-word',
    },
    stepperStyle: {
      backgroundColor: 'transparent',
      [theme.breakpoints.down('sm')]: {
        padding: 0,
        paddingTop: theme.spacing(2),
      },
    },
  })
);

const NewGame: React.FC = () => {
  const { saveGame, loading, error: saveGameError, addedGame } = useSaveGame();
  const classes = useStyles();
  const { players, error: playerError } = useNewKotitonniPlayers();
  const [gameType, setGameType] = React.useState<GameType | null>(null);
  const [price, setPrice] = React.useState<number>(0);
  const [startTime, setStartTime] = React.useState<null | Date>(new Date());
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = React.useMemo(() => ['Ajankohta', 'Pelimuoto', 'Hinta'], []);
  const errors = React.useMemo(() => {
    const errors = [];

    if (saveGameError) errors.push(saveGameError);
    if (playerError) errors.push(playerError);

    return errors;
  }, [saveGameError, playerError]);

  const handleSelectGame = React.useCallback((selection: GameType) => {
    setGameType(selection);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }, []);

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

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      if (!players || !gameType || !startTime) {
        return;
      } else {
        const gameToAdd = {
          players,
          price,
          startTime,
          type: gameType,
          status: GameStatus.UPCOMING,
          rounds: 3,
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
      <div className={classes.headline}>
        <div className={classes.neonLight}></div>
        <Typography variant="h3" color="initial">
          Luo uusi peli
        </Typography>
      </div>
      <Stepper
        className={classes.stepperStyle}
        activeStep={activeStep}
        orientation="vertical"
      >
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>
              <Typography variant="h5">{label}</Typography>
            </StepLabel>
            <StepContent>
              {getStepContent(index)}
              <div className={classes.actionsContainer}>
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    variant="text"
                    className={classes.button}
                  >
                    Palaa
                  </Button>
                  {activeStep !== 1 && ( // not shown when choosing game type
                    <Button onClick={handleNext} className={classes.button}>
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
        <BottomContent
          errors={errors}
          loading={loading}
          addedGame={addedGame}
        />
      )}
    </div>
  );
};

export default NewGame;
