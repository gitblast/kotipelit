import React from 'react';

import { Paper, Typography, Divider } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import HostView from './host/HostView';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    container: {
      padding: theme.spacing(2),
    },
  })
);

interface ChannelPageProps {
  labelText: string;
}

const ChannelPage: React.FC<ChannelPageProps> = ({ labelText }) => {
  const classes = useStyles();

  return (
    <Paper elevation={5} className={classes.container}>
      <div className={classes.header}>
        <Typography variant="h3">{labelText}</Typography>
      </div>
      <Divider />
      <HostView gameRunning={false} />
    </Paper>
  );
};

export default ChannelPage;
