import React from 'react';

import { Paper, Typography, Divider } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import NewGame from './host/NewGame';
import KotitonniHostView from './kotitonni/KotitonniHostView';
import KotitonniPlayerView from './kotitonni/KotitonniPlayerView';
import RTCGameRoom from './RTCGameRoom';
import Dashboard from './host/Dashboard';
import { useSelector } from 'react-redux';
import { State, BaseUser } from '../types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    marginBottom: {
      margin: 'auto',
    },
    container: {
      padding: 0,
      margin: 0,
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
      <Paper elevation={4} className={classes.container}>
        {/* <Typography variant="h3" gutterBottom>
          {labelText}
        </Typography>
        
        <Divider className={classes.marginBottom} /> */}
        <Switch>
          <Route path="/:username/newgame">
            {user.loggedIn && <NewGame />}
          </Route>
          <Route path="/username/pelit/rtc/:gameID">
            {user.loggedIn && <RTCGameRoom isHost />}
          </Route>
          <Route path="/:username/pelit/:gameID">
            {user.loggedIn && <KotitonniHostView user={user} />}
          </Route>
          <Route path="/:username/rtc/:playerId">
            {!user.loggedIn && <RTCGameRoom />}
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
