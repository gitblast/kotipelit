import React from 'react';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { CircularProgress } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    centered: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
  })
);

interface LoaderProps {
  msg: string;
}

const Loader: React.FC<LoaderProps> = ({ msg }) => {
  const classes = useStyles();

  return (
    <div className={classes.centered}>
      <Typography gutterBottom>{msg}</Typography>
      <div>
        <CircularProgress />
      </div>
    </div>
  );
};

export default Loader;
