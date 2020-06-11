import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';

import HostPanel from './HostPanel';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
    },
    jitsiContainer: {
      width: '65%',
      padding: theme.spacing(2),
      backgroundColor: theme.palette.grey[400],
    },
    hostControls: {
      width: '35%',
      padding: theme.spacing(2),
      marginLeft: theme.spacing(1),
    },
  })
);

// interface SanaKiertoProps {}

const SanaKierto: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Paper elevation={5} className={classes.jitsiContainer}>
        <Typography>Jitsi</Typography>
      </Paper>
      <Paper elevation={5} className={classes.hostControls}>
        <HostPanel />
      </Paper>
    </div>
  );
};

export default SanaKierto;
