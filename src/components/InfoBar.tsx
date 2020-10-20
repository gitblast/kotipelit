import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { State } from '../types';
import { Paper, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { url } from 'inspector';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      display: 'flex',
      alignItems: 'center',
      backgroundImage: 'url(images/jazz-theme.jpg)',
      backgroundColor: 'rgba(34, 34, 59)',
      color: 'rgba(218, 214, 214)',
      width: '100%',
    },
    textContainer: {
      marginLeft: theme.spacing(2),
    },
    turn: {
      // Keep the same as videoframe hasTurn
      color: 'rgba(244, 172, 69)',
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
              ? 'Sinun vuorosi!'
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
          <Typography>{getText()}</Typography>
        </div>
      )}
    </Paper>
  );
};

export default InfoBar;
