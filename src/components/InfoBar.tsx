import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { GameStatus, State } from '../types';
import { Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      color: 'rgba(218, 214, 214)',
      width: '100%',
    },
    nextUpText: {
      // Keep the same as videoframe hasTurn
      color: 'rgba(229, 197, 39)',
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
      marginLeft: theme.spacing(2),
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
        <Typography variant="h5" className={classes.nextUpText}>
          {playerWithTurn.id === self?.id
            ? `Sinun vuorosi!`
            : `Vuorossa: ${playerWithTurn.name}`}
        </Typography>
        {(self?.isHost || playerWithTurn.id === self?.id) && (
          <Typography
            variant="h5"
            className={classes.wordsText}
          >{` ${playerWithTurn.data.words.join(', ')}`}</Typography>
        )}
      </div>
    );
  };

  return (
    <div className={classes.container}>{players && <div>{getText()}</div>}</div>
  );
};

export default InfoBar;
