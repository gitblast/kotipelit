import React from 'react';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { checkForUser } from './reducers/user.reducer';
import { initChannels } from './reducers/channels.reducer';

import FrontPage from './components/FrontPage';
import Footer from './components/Footer';
import LoginForm from './components/LoginForm';
import UserControls from './components/UserControls';

import ChannelPage from './components/ChannelPage';
import { State, HostChannel } from './types';
import { initGames } from './reducers/games.reducer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    navbar: {
      // marginBottom: theme.spacing(3),
      // maxWidth: 1230,
      margin: 'auto',
    },
    toolbar: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    container: {
      width: '100%',
      paddingBottom: '60px',
    },
  })
);

/** @TODO catch 404 */

const App = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const user = useSelector((state: State) => state.user, shallowEqual);

  const channels = useSelector(
    (state: State) => state.channels.allChannels,
    shallowEqual
  );

  // init channels and games and check local storage for user
  React.useEffect(() => {
    dispatch(checkForUser());
    dispatch(initChannels());
  }, [dispatch]);

  React.useEffect(() => {
    if (user.loggedIn) {
      dispatch(initGames());
    }
  }, [user.loggedIn, dispatch]);

  const channelRoutes = (channels: HostChannel[]) => {
    return channels.map((channel) => (
      <Route key={channel.username} path={`/${channel.username}`}>
        <ChannelPage labelText={channel.channelName} />
      </Route>
    ));
  };

  return (
    <Router>
      <AppBar position="static" className={classes.navbar}>
        <Toolbar className={classes.toolbar}>
          <Button color="inherit" component={Link} to="/">
            <Typography variant="subtitle1">Kotipelit.com</Typography>
          </Button>
          <UserControls user={user} />
        </Toolbar>
      </AppBar>
      <div className={classes.container}>
        <Switch>
          {channelRoutes(channels)}
          <Route path="/kirjaudu">
            <LoginForm />
          </Route>
          <Route path="/">
            <FrontPage />
          </Route>
        </Switch>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
