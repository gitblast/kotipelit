import React from 'react';

import { Paper, Typography, Divider } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import HostView from './host/HostView';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
    <Paper elevation={3} className={classes.container}>
      <Typography variant="h3">{labelText}</Typography>
      <Divider />
      <HostView gameRunning={false} />
    </Paper>
  );
};

export default ChannelPage;
