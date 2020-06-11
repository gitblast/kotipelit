import React from 'react';

import { Paper, Typography, Divider } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import NewGame from './host/NewGame';
import Sanakierto from './host/sanakierto/Sanakierto';
import Dashboard from './host/Dashboard';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    marginBottom: {
      marginBottom: theme.spacing(2),
    },
    container: {
      padding: theme.spacing(3),
    },
  })
);

interface ChannelPageProps {
  labelText: string;
}

/** @TODO guestview */
const ChannelPage: React.FC<ChannelPageProps> = ({ labelText }) => {
  const classes = useStyles();

  return (
    <Router>
      <Paper elevation={5} className={classes.container}>
        <Typography variant="h3" gutterBottom>
          {labelText}
        </Typography>
        <Divider className={classes.marginBottom} />
        <Switch>
          <Route path="/:username/newgame">
            <NewGame />
          </Route>
          <Route path="/:username/:gameID">
            <Sanakierto />
          </Route>
          <Route path="/">
            <Dashboard />
          </Route>
        </Switch>
      </Paper>
    </Router>
  );
};

export default ChannelPage;
