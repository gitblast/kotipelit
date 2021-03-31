import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(3),
      textAlign: 'center',
    },
  })
);

// interface NotFoundPageProps {}

const NotFoundPage = () => {
  const classes = useStyles();

  return (
    <Paper className={classes.container}>
      <Typography variant="h1">404</Typography>
      <Typography>Etsimääsi sivua ei löytynyt</Typography>
    </Paper>
  );
};

export default NotFoundPage;
