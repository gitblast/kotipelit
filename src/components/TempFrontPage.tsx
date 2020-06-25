import React from 'react';

import { Link } from 'react-router-dom';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Typography, Button } from '@material-ui/core';
import { useSelector, shallowEqual } from 'react-redux';
import { State } from '../types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: { padding: theme.spacing(2), textAlign: 'center' },
    linkContainer: { marginTop: theme.spacing(2) },
  })
);

// interface FrontPageProps {}

const FrontPage: React.FC = () => {
  const classes = useStyles();

  const channels = useSelector(
    (state: State) => state.channels.allChannels,
    shallowEqual
  );

  const mapChannels = () => {
    return channels.map((channel) => (
      <div key={channel.username} className={classes.linkContainer}>
        <Button component={Link} to={`/${channel.username}`} variant="outlined">
          {channel.channelName}
        </Button>
      </div>
    ));
  };

  return (
    <div className={classes.container}>
      <div>
        <Typography variant="h3">Kanavat:</Typography>
      </div>
      {mapChannels()}
    </div>
  );
};

export default FrontPage;
