import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { GameStatus, Role } from '../types';
import { Typography } from '@material-ui/core';
import { useGameData } from '../context';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      color: 'rgba(218, 214, 214)',
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
    nextUpText: {
      color: theme.palette.primary.light,
      [theme.breakpoints.down('sm')]: {
        fontSize: '16px',
      },
    },
    wordsText: {
      [theme.breakpoints.down('sm')]: {
        fontSize: '16px',
      },
    },
    infoBarText: {
      [theme.breakpoints.down('sm')]: {
        display: 'flex',
      },
    },
  })
);

const InfoBar: React.FC = () => {
  const classes = useStyles();

  const { game, self } = useGameData();

  const gameStatus = game.status;
  const players = game.players;

  const playerWithTurn = React.useMemo(() => {
    return players.find((player) => player.hasTurn);
  }, [players]);

  const getText = () => {
    if (!playerWithTurn) {
      return null;
    }

    if (gameStatus === GameStatus.FINISHED) {
      return (
        // korjaa tämä!
        <div>
          <Typography variant="h6" color="secondary">
            Peli on päättynyt! Kiitos osallistumisesta. Muista antaa palautetta.
          </Typography>
        </div>
      );
    }

    return (
      <div className={classes.infoBarText}>
        <Typography variant="body1" className={classes.nextUpText}>
          {playerWithTurn.id === self?.id
            ? `Sinun vuorosi!`
            : `Vuorossa: ${playerWithTurn.name}`}
        </Typography>
        {(self.role === Role.HOST || playerWithTurn.id === self.id) && (
          <Typography
            variant="body1"
            className={classes.wordsText}
          >{` - ${playerWithTurn.privateData.words.join(', ')}`}</Typography>
        )}
      </div>
    );
  };

  return (
    <div className={classes.container}>{players && <div>{getText()}</div>}</div>
  );
};

export default InfoBar;
