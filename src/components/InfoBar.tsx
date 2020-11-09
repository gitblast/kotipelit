import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { GameStatus, State } from '../types';
import { Paper, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      display: 'flex',
      alignItems: 'center',
      backgroundColor: 'rgba(15, 17, 15)',
      color: 'rgba(218, 214, 214)',
      width: '100%',
    },
    textContainer: {
      marginLeft: theme.spacing(2),
    },
    nextUpText: {
      // Keep the same as videoframe hasTurn
      color: 'rgba(199, 204, 57)',
    },
  })
);

const InfoBar: React.FC = () => {
  const classes = useStyles();

  const gameStatus = useSelector((state: State) => state.rtc.game?.status);
  const players = useSelector((state: State) => state.rtc.game?.players);
  const self = useSelector((state: State) => state.rtc.self);

  const playerWithTurn = React.useMemo(() => {
    if (!players) {
      return null;
    }

    return players.find((player) => player.hasTurn);
  }, [players]);

  const getText = () => {
    if (!playerWithTurn) {
      return null;
    }

    if (gameStatus === GameStatus.FINISHED) {
      return (
        <span>
          Peli on päättynyt! Kiitos osallistumisesta. Muista antaa palautetta.
        </span>
      );
    }

    return (
      <>
        <span className={classes.nextUpText}>
          {playerWithTurn.id === self?.id
            ? `Sinun vuorosi! - Sanasi: ${playerWithTurn.words.join(', ')}`
            : `Vuorossa: ${playerWithTurn.name}`}
        </span>
        {self?.isHost && (
          <span>{` - Sanat: ${playerWithTurn.words.join(', ')}`}</span>
        )}
      </>
    );
  };

  return (
    <Paper className={classes.container} square>
      {players && (
        <div className={classes.textContainer}>
          <Typography>{getText()}</Typography>
        </div>
      )}
    </Paper>
  );
};

export default InfoBar;
