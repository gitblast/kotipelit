import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Typography, Badge } from '@material-ui/core';

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
    welcomeMsg: {
      marginBottom: 40,
    },
    headLine: {
      paddingBottom: 15,
    },
    btnStart: {
      textAlign: 'center',

      padding: 45,
    },
    flexing: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  })
);

interface WaitingRoomProps {
  game: KotitonniActive;
}

const WaitingRoom: React.FC<WaitingRoomProps> = ({ game }) => {
  const classes = useStyles();

  return (
    <div className={classes.participants}>
      {game.players.map((p) => (
        <div key={p.id}>
          <Typography className={classes.participants}>
            {p.name}
            {p.online ? (
              <Badge variant="dot" color="secondary"></Badge>
            ) : (
              <Badge variant="dot" color="error"></Badge>
            )}
          </Typography>
        </div>
      ))}
    </div>
  );
};

export default WaitingRoom;
