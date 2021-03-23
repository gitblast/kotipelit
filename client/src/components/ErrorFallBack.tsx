import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Fab, Paper, Typography } from '@material-ui/core';
import { FallbackProps } from 'react-error-boundary';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(3),
      textAlign: 'center',
    },
  })
);

const ErrorFallBack: React.FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  const classes = useStyles();

  return (
    <Paper className={classes.container}>
      <Typography variant="h1" gutterBottom>
        Tapahtui odottamaton virhe:
      </Typography>
      <Typography gutterBottom>{error.message}</Typography>
      <Fab variant="extended" onClick={resetErrorBoundary}>
        Yritä uudestaan
      </Fab>
    </Paper>
  );
};

export default ErrorFallBack;
