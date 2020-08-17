import React from 'react';

import { Paper, Typography, Divider } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import NewGame from './host/NewGame';
import Sanakierto from './sanakierto/SanaKierto';
import Dashboard from './host/Dashboard';
import { useSelector } from 'react-redux';
import { State, LoggedUser, User } from '../types';

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

const checkLogIn = (userToValidate: User): LoggedUser | null => {
  if (userToValidate && userToValidate.loggedIn) return userToValidate;

  return null;
};

/** @TODO guestview */
const ChannelPage: React.FC<ChannelPageProps> = ({ labelText }) => {
  const classes = useStyles();

  const user = useSelector((state: State) => state.user);

  const loggedInUser = checkLogIn(user);

  return (
    <Router>
      <Paper elevation={5} className={classes.container}>
        <Typography variant="h3" gutterBottom>
          {labelText}
        </Typography>
        <Divider className={classes.marginBottom} />
        <Switch>
          <Route path="/:username/newgame">
            {loggedInUser ? <NewGame /> : null}
          </Route>
          <Route path="/:username/pelit/:gameID">
            <Sanakierto />
          </Route>
          <Route path="/:username/:playerID">
            <Sanakierto />
          </Route>
          <Route path="/">
            {loggedInUser ? <Dashboard user={loggedInUser} /> : null}
          </Route>
        </Switch>
      </Paper>
    </Router>
  );
};

export default ChannelPage;
