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
  })
);

interface InfoBarProps {
  game: RTCGame | null;
}

const InfoBar: React.FC<InfoBarProps> = ({ game }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.container}>
      {game && <Typography variant="h4">{game.type}</Typography>}
    </Paper>
  );
};

export default InfoBar;
