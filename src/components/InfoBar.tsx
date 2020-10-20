import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { State } from '../types';
import { Paper, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(1),
      display: 'flex',
      alignItems: 'center',
      backgroundColor: 'black',
      color: 'white',
      width: '96%',
      marginBottom: theme.spacing(0.5),
    },
    textContainer: {
      marginLeft: theme.spacing(1),
    },
  })
);

const InfoBar: React.FC = () => {
  const classes = useStyles();

  const players = useSelector((state: State) => state.rtc.game?.players);
  const self = useSelector((state: State) => state.rtc.self);

  const playerWithTurn = React.useMemo(() => {
    if (!players) {
      return null;
    }

    return players.find((player) => player.hasTurn);
  }, [players]);

  const getText = React.useCallback(() => {
    if (playerWithTurn) {
      return (
        <>
          <span>
            {playerWithTurn.id === self?.id
              ? `Sinun vuorosi! - Sanasi: ${playerWithTurn.words.join(', ')}`
              : `Vuorossa: ${playerWithTurn.name}`}
          </span>
          {self?.isHost && (
            <span>{` - Sanat: ${playerWithTurn.words.join(', ')}`}</span>
          )}
        </>
      );
    }
  }, [playerWithTurn, self]);

  return (
    <Paper className={classes.container}>
      {players && (
        <div className={classes.textContainer}>
          <Typography variant="h6">{getText()}</Typography>
        </div>
      )}
    </Paper>
  );
};

export default InfoBar;
