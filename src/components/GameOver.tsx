import React from 'react';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    test: {
      backgroundColor: 'red',
    },
  })
);

const GameOver = () => {
  const classes = useStyles();
  return (
    <>
      <Paper className={classes.test}>
        <Typography>Hostin arvostelu</Typography>
        <Typography>Ongelmia yhteydessä?</Typography>
      </Paper>
    </>
  );
};

export default GameOver;
