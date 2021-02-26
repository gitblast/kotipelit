import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@material-ui/core';

import { CircularProgress } from '@material-ui/core';

import ChooseDate from './ChooseDate';
import ChooseGame from './ChooseGame';
import ChoosePrice from './ChoosePrice';

import { initializePlayers } from '../../helpers/games';
import { addLocalGame } from '../../reducers/games.reducer';

import gameService from '../../services/games';
import { useHistory } from 'react-router-dom';

import { GameType, GameStatus, RTCKotitonniPlayer, RTCGame } from '../../types';
import logger from '../../utils/logger';
import { useDispatch } from 'react-redux';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      marginLeft: theme.spacing(4),
      color: 'rgb(0 225 217)',
    },
    primaryDark: {
      color: theme.palette.primary.dark,
    },
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    actionsContainer: {
      marginBottom: theme.spacing(2),
    },
    resetContainer: {
      marginTop: theme.spacing(6),
      marginLeft: theme.spacing(6),
      marginRight: theme.spacing(6),
      [theme.breakpoints.down('sm')]: {
        margin: 0,
        width: '90%',
      },
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
    stepperContent: {
      borderLeft: '4px solid',
      borderColor: theme.palette.primary.main,
    },
  })
);

interface GameToAdd {
  startTime: Date;
  type: GameType;
  players: RTCKotitonniPlayer[];
  status: GameStatus;
  rounds: number;
  price: number;
}

const NewGame: React.FC<{ username: string }> = ({ username }) => {
  const classes = useStyles();
  const [gameType, setGameType] = React.useState<GameType | null>(null);
  const [price, setPrice] = React.useState<number>(0);
  const [players, setPlayers] = React.useState<null | RTCKotitonniPlayer[]>(
    null
  );
  const [startTime, setStartTime] = React.useState<null | Date>(new Date());
  const [activeStep, setActiveStep] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [addedGame, setAddedGame] = React.useState<RTCGame | null>(null);
  const steps = React.useMemo(() => ['Ajankohta', 'Pelimuoto', 'Hinta'], []);
  const history = useHistory();
  const dispatch = useDispatch();

  React.useEffect(() => {
    const init = async () => {
      const initialPlayers = await initializePlayers(5, 3);
      setPlayers(initialPlayers);
    };

    try {
      init();
    } catch (error) {
      console.error('error initializing players for new game:', error.message);

      setError(error.message);
    }
  }, []);

  const handleSelectGame = React.useCallback((selection: GameType) => {
    setGameType(selection);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }, []);

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
    setLoading(true);

    logger.log(`adding new game`, gameToAdd);

    try {
      const added = await gameService.addNew(gameToAdd);

      setAddedGame(added);

      dispatch(addLocalGame(added));
    } catch (e) {
      setError(e.message);
    }

    setLoading(false);
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
        };

        saveGame(gameToAdd);
      }
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const bottomContent = () => {
    if (error) {
      return <div>{error}</div>;
    }

    if (loading) {
      return <CircularProgress />;
    }

    if (addedGame) {
      const baseUrl =
        // eslint-disable-next-line no-undef
        process && process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000'
          : 'https://www.kotipelit.com';

      return (
        <div className={classes.resetContainer}>
          <Typography variant="caption">{`${baseUrl}/${username}/kutsut/${addedGame.id}`}</Typography>
          <Typography>
            Jaa ylläoleva peliaulan linkki henkilöille, jotka haluat kutsua
            pelaamaan.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleReturn}
            className={classes.button}
          >
            Oma profiili
          </Button>
          {/* How to include game id?  */}
          {/* <Button
            variant="contained"
            color="secondary"
            component={Link}
            to={`/${username}/kutsut/${game.id}`}
          >
            Peliaula
          </Button> */}
        </div>
      );
    }

    setError('Odottamaton virhe peliä lisätessä');
  };

  return (
    <div className={classes.root}>
      <Typography variant="h5">Luo uusi peli</Typography>
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
            <StepContent className={classes.stepperContent}>
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
      {activeStep === steps.length && bottomContent()}
    </div>
  );
};

export default NewGame;
