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
import { useParams, useHistory } from 'react-router';
import { GameStatus, GameType } from '../../types';
import logger from '../../utils/logger';
import AddedGameInfo from './AddedGameInfo';
import ChooseDate from './ChooseDate';
import ChooseGame from './ChooseGame';
import GameSettings from './GameSettings';
import useNewKotitonniPlayers from './useNewKotitonniPlayers';
import useSaveGame from './useSaveGame';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      marginLeft: theme.spacing(4),
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
      width: '11vw',
      alignSelf: 'center',
      marginTop: '6px',
    },
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
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
    returnBtn: {
      color: '#8da1a1',
    },
  })
);

enum Steps {
  AJANKOHTA,
  PELIMUOTO,
  ASETUKSET,
  KUTSU_PELAAJAT,
}

const NewGame: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const history = useHistory();
  const { saveGame, error: saveGameError, addedGame } = useSaveGame();
  const classes = useStyles();
  const { players, setPlayers, error: playerError } = useNewKotitonniPlayers();
  const [gameType, setGameType] = React.useState<GameType | null>(null);
  const [startTime, setStartTime] = React.useState<null | Date>(new Date());
  const [activeStep, setActiveStep] = React.useState(0);
  const [settings, setSettings] = React.useState({
    price: 0,
    allowedSpectators: 40,
  });
  const steps = React.useMemo(
    () => ['Ajankohta', 'Pelimuoto', 'Asetukset', 'Kutsu pelaajat'],
    []
  );

  const handleSelectGame = React.useCallback((selection: GameType) => {
    setGameType(selection);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }, []);

  const getStepContent = (step: number) => {
    switch (step) {
      case Steps.AJANKOHTA:
        return <ChooseDate selected={startTime} setSelected={setStartTime} />;
      case Steps.PELIMUOTO:
        return <ChooseGame handleSelect={handleSelectGame} />;
      case Steps.ASETUKSET:
        return (
          <GameSettings
            handleSettingsChange={setSettings}
            settings={settings}
            players={players}
            handlePlayerChange={setPlayers}
            error={playerError}
          />
        );
      case Steps.KUTSU_PELAAJAT:
        return <AddedGameInfo addedGame={addedGame} error={saveGameError} />;
      default:
        return 'Unknown step';
    }
  };

  const handleNext = () => {
    if (activeStep === Steps.ASETUKSET) {
      if (!players || !gameType || !startTime) {
        logger.error('something important missing');

        return;
      } else {
        const gameToAdd = {
          players,
          price: settings.price,
          allowedSpectators: settings.allowedSpectators,
          startTime,
          type: gameType,
          status: GameStatus.UPCOMING,
          rounds: 3,
        };

        saveGame(gameToAdd);
      }
    }

    if (activeStep === Steps.KUTSU_PELAAJAT) {
      history.push(`/${username}`);
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
        <Typography variant="h4" color="initial">
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
              <Typography variant="h3">{label}</Typography>
            </StepLabel>
            <StepContent>
              {getStepContent(index)}
              <div className={classes.actionsContainer}>
                <div>
                  {activeStep !== steps.length - 1 && (
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      variant="text"
                      className={classes.returnBtn}
                    >
                      Palaa
                    </Button>
                  )}
                  {activeStep !== 1 && ( // not shown when choosing game type
                    <Button
                      onClick={handleNext}
                      color="primary"
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
    </div>
  );
};

export default NewGame;
