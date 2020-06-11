import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Typography, Fab } from '@material-ui/core';

import ScoreBoard from './ScoreBoard';
import {
  SanakiertoActive,
  SanakiertoPlayer,
  GameStatus,
} from '../../../../types';
import { useDispatch } from 'react-redux';
import { updateGame } from '../../../../reducer/reducer';
import useInterval from '../../../../hooks/useInterval';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(1),
    },
    flex: {
      display: 'flex',
      alignItems: 'center',
    },
    grow: {
      flexGrow: 1,
    },
  })
);

interface HostPanelProps {
  game: SanakiertoActive;
}

/** @TODO set game status running */

const HostPanel: React.FC<HostPanelProps> = ({ game }) => {
  const classes = useStyles();

  const [timerRunning, setTimerRunning] = React.useState<boolean>(false);
  const [timer, setTimer] = React.useState<number>(90);

  const dispatch = useDispatch();

  useInterval(
    () => {
      setTimer(timer - 1);

      if (timer === 1) {
        setTimerRunning(false);
      }
    },
    timerRunning ? 1000 : null
  );

  const playerWithTurn = game.players[game.turn];

  if (!playerWithTurn)
    throw new Error('Something went wrong with player turns');

  const handleUpdate = (players: SanakiertoPlayer[]): void => {
    const turn = game.turn === players.length - 1 ? 0 : game.turn + 1;
    const round = turn === 0 ? game.round + 1 : game.round;

    const newGameState: SanakiertoActive = {
      ...game,
      players,
      turn,
      round,
      status: round > game.rounds ? GameStatus.FINISHED : GameStatus.RUNNING,
    };

    console.log('updating with', newGameState);

    dispatch(updateGame(newGameState));
    if (timerRunning) setTimerRunning(false);
    setTimer(90);
  };

  const startTimer = () => {
    if (timer !== 0) {
      setTimerRunning(!timerRunning);
    }
  };

  return (
    <div className={classes.container}>
      <Typography variant="h6">{`Kierros ${game.round}`}</Typography>
      <div className={classes.flex}>
        <div className={classes.grow}>
          <Typography
            variant="overline"
            component="div"
            className={classes.grow}
          >
            Vuorossa:
          </Typography>
          <Typography component="div" gutterBottom>
            {playerWithTurn.name}
          </Typography>
        </div>
        <div className={classes.grow}>
          <Typography
            variant="overline"
            component="div"
            className={classes.grow}
          >
            Sanat:
          </Typography>
          <Typography component="div" gutterBottom>
            {playerWithTurn.words.join(' / ')}
          </Typography>
        </div>
      </div>
      <div>
        <Typography variant="overline" component="div">
          Vastausaika:
        </Typography>
        <div className={classes.flex}>
          <Typography component="div" className={classes.grow}>
            {timer !== 0 ? (
              `${timer} sekuntia`
            ) : (
              <Typography color="textSecondary">Aika loppui</Typography>
            )}
          </Typography>
          <div className={classes.grow}>
            <Fab
              variant="extended"
              size="small"
              color="secondary"
              onClick={startTimer}
              disabled={timer === 0}
            >
              {timerRunning ? 'Pysäytä' : 'Käynnistä'}
            </Fab>
          </div>
        </div>
      </div>
      <ScoreBoard
        players={game.players}
        turn={game.turn}
        handleUpdate={handleUpdate}
      />
    </div>
  );
};

export default HostPanel;
