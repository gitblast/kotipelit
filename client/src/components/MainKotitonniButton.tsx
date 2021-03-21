import { Fab, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import { GameStatus } from '../types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    pointsButton: {
      background: 'linear-gradient(to bottom, rgb(36 170 167), rgb(33 36 36))',
      color: 'white',
      // Give the box shadow when button is relevant?
      boxShadow: 'rgb(231 239 191) 4px 3px 18px',
      padding: 36,
      border: 'solid',
      borderColor: 'white',
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(3.5),
      },
    },
  })
);

interface MainKotitonniButtonProps {
  gameStatus: GameStatus;
  disabled: boolean;
  handlePointUpdate: () => void;
  handleFinish: () => void;
  handleStart: () => void;
}

const MainKotitonniButton: React.FC<MainKotitonniButtonProps> = ({
  gameStatus,
  disabled,
  handleFinish,
  handlePointUpdate,
  handleStart,
}) => {
  const classes = useStyles();

  const getMainButtonClickHandler = (status: GameStatus) => {
    switch (status) {
      case GameStatus.RUNNING:
        return handlePointUpdate;
      case GameStatus.FINISHED:
        return handleFinish;
      default:
        return handleStart;
    }
  };

  const getMainButtonLabel = (status: GameStatus) => {
    switch (status) {
      case GameStatus.RUNNING:
        return 'Päivitä pisteet';
      case GameStatus.FINISHED:
        return 'Lopeta peli';
      default:
        return 'Aloita peli';
    }
  };

  return (
    <Fab
      className={classes.pointsButton}
      onClick={getMainButtonClickHandler(gameStatus)}
      disabled={disabled}
      variant="extended"
    >
      <Typography variant="h6">{getMainButtonLabel(gameStatus)}</Typography>
    </Fab>
  );
};

export default MainKotitonniButton;
