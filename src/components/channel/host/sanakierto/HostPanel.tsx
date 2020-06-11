import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Typography, Fab } from '@material-ui/core';

import ScoreBoard from './ScoreBoard';
import { SanakiertoActive, SanakiertoPlayer } from '../../../../types';
import { useDispatch } from 'react-redux';
import { updateGame } from '../../../../reducer/reducer';

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

const HostPanel: React.FC<HostPanelProps> = ({ game }) => {
  const classes = useStyles();

  const dispatch = useDispatch();

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
    };

    console.log('updating with', newGameState);

    dispatch(updateGame(newGameState));
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
          Selitysaika:
        </Typography>
        <div className={classes.flex}>
          <Typography component="div" className={classes.grow}>
            90 sekuntia
          </Typography>
          <div className={classes.grow}>
            <Fab variant="extended" size="small" color="secondary">
              Käynnistä
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
