import React from 'react';

import { Paper, Typography, Divider } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import NewGame from './host/NewGame';
import KotitonniHostView from './sanakierto/KotitonniHostView';
import KotitonniPlayerView from './sanakierto/KotitonniPlayerView';
import Dashboard from './host/Dashboard';
import { useSelector } from 'react-redux';
import { State, BaseUser } from '../types';

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

  const user = useSelector((state: State) => state.user);

  return (
    <Router>
      <Paper elevation={5} className={classes.container}>
        <Typography variant="h3" gutterBottom>
          {labelText}
        </Typography>
        <Divider className={classes.marginBottom} />
        <Switch>
          <Route path="/:username/newgame">
            {user.loggedIn && <NewGame />}
          </Route>
          <Route path="/:username/pelit/:gameID">
            {user.loggedIn && <KotitonniHostView user={user} />}
          </Route>
          <Route path="/:username/:playerId">
            {!user.loggedIn && <KotitonniPlayerView user={user as BaseUser} />}
          </Route>
          <Route path="/">{user.loggedIn && <Dashboard user={user} />}</Route>
        </Switch>
      </Paper>
    </Router>
  );
};

export default ChannelPage;
