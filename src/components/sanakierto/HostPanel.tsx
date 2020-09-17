import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Typography, Fab } from '@material-ui/core';
import ScoreBoard from './ScoreBoard';
import { KotitonniActive, KotitonniPlayer, State } from '../../types';
import { useSelector } from 'react-redux';
import useInterval from '../../hooks/useInterval';
import { updateGame } from '../../services/socketio/actions';

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
  game: KotitonniActive;
}

const HostPanel: React.FC<HostPanelProps> = ({ game }) => {
  const classes = useStyles();
  const socket = useSelector((state: State) => state.user.socket);

  const [timerRunning, setTimerRunning] = React.useState<boolean>(false);
  const [timer, setTimer] = React.useState<number>(90);

  useInterval(
    () => {
      setTimer(timer - 1);

      if (timer === 1) {
        setTimerRunning(false);
      }
    },
    timerRunning ? 1000 : null
  );

  if (!socket) return <Typography>Yhdistetään...</Typography>;

  const { players, info } = game;

  const playerInTurnIndex = players.findIndex(
    (player) => player.id === info.turn
  );

  if (playerInTurnIndex < 0)
    throw new Error('Something went wrong with player turns');

  const playerWithTurn = players[playerInTurnIndex];

  const handleUpdate = (players: KotitonniPlayer[]): void => {
    let round: number;
    let turn: string;

    if (playerInTurnIndex === players.length - 1) {
      round = game.info.round + 1;
      turn = players[0].id;
    } else {
      round = game.info.round;
      turn = players[playerInTurnIndex + 1].id;
    }

    const newGameState: KotitonniActive = {
      ...game,
      players,
      info: {
        round,
        turn,
      },
    };

    updateGame(newGameState);
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
      <Typography variant="h6">{`Kierros ${game.info.round} / 3`}</Typography>
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
        turn={game.players.indexOf(playerWithTurn)}
        handleUpdate={handleUpdate}
      />
    </div>
  );
};

export default HostPanel;
