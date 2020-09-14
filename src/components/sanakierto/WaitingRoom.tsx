import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  TableBody,
  Table,
  Fab,
  TableRow,
  Grid,
  Typography,
  Badge,
} from '@material-ui/core';

import { KotitonniActive } from '../../types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    startBtn: {
      textAlign: 'center',
      margin: theme.spacing(2),
    },
    participants: {
      display: 'flex',
      justifyContent: 'space-around',
    },
  })
);

interface WaitingRoomProps {
  game: KotitonniActive;
  handleStart?: () => void;
}

const WaitingRoom: React.FC<WaitingRoomProps> = ({ game, handleStart }) => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.participants}>
        {game.players.map((p) => (
          <div key={p.id}>
            <Typography className={classes.participants}>
              {p.name}
              {p.online ? (
                <Badge variant="dot" color="primary"></Badge>
              ) : (
                <Badge variant="dot" color="error"></Badge>
              )}
            </Typography>
          </div>
        ))}
      </div>

      <div>
        {handleStart && (
          <div className={classes.startBtn}>
            <Fab variant="extended" onClick={handleStart}>
              Aloita peli
            </Fab>
          </div>
        )}
      </div>
    </>
  );
};

export default WaitingRoom;
