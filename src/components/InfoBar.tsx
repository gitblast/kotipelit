import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { RTCGame } from '../types';
import { Paper, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      display: 'flex',
      alignItems: 'center',
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

interface InfoBarProps {
  game: RTCGame | null;
  isHost?: boolean;
}

const InfoBar: React.FC<InfoBarProps> = ({ game, isHost }) => {
  const classes = useStyles();

  const playerWithTurn = React.useMemo(
    () => game?.players.find((player) => player.hasTurn),
    [game]
  );

  const getText = React.useCallback(() => {
    if (playerWithTurn) {
      return (
        <>
          <span
            className={classes.turn}
          >{`Vuorossa: ${playerWithTurn.name}`}</span>
          {isHost && (
            <span>{` - Sanat: ${playerWithTurn.words.join(', ')}`}</span>
          )}
        </>
      );
    }
  }, [playerWithTurn, isHost]);

  return (
    <Paper className={classes.container} square>
      {game && (
        <div className={classes.textContainer}>
          <Typography>{getText()}</Typography>
        </div>
      )}
    </Paper>
  );
};

export default InfoBar;
