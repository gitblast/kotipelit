import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { RTCGame } from '../types';
import { Paper, Typography } from '@material-ui/core';

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
          <span>{`Vuorossa: ${playerWithTurn.name}`}</span>
          {isHost && (
            <span>{` - Sanat: ${playerWithTurn.words.join(', ')}`}</span>
          )}
        </>
      );
    }
  }, [playerWithTurn, isHost]);

  return (
    <Paper className={classes.container}>
      {game && (
        <div className={classes.textContainer}>
          <Typography variant="h6">{getText()}</Typography>
        </div>
      )}
    </Paper>
  );
};

export default InfoBar;
