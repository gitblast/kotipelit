import React from 'react';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
} from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { initGames } from './reducers/games.reducer';
import { loginUser } from './reducers/user.reducer';
import { initChannels } from './reducers/channels.reducer';

import FrontPage from './components/FrontPage';
import TempFrontPage from './components/TempFrontPage';

import ChannelPage from './components/channel/ChannelPage';
import { State, HostChannel } from './types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    navbar: {
      marginBottom: theme.spacing(3),
    },
    toolbar: {
      display: 'flex',
      justifyContent: 'space-between',
    },
  })
);

const App = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const user = useSelector((state: State) => state.user, shallowEqual);
  const channels = useSelector(
    (state: State) => state.channels.allChannels,
    shallowEqual
  );

  // init channels
  React.useEffect(() => {
    dispatch(initChannels());
  }, [dispatch]);

  // init games
  React.useEffect(() => {
    if (user && user.loggedIn) dispatch(initGames());
  }, [dispatch, user]);

  const handleLogin = () => {
    dispatch(loginUser('username', 'password'));
  };

  const channelRoutes = () => {
    return channels.map((channel: HostChannel) => (
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
            <Typography variant="h6">Kotipelit.com</Typography>
          </Button>
          <Button color="inherit" onClick={handleLogin}>
            <Typography>Kirjaudu</Typography>
          </Button>
        </Toolbar>
      </AppBar>
      <Container>
        <Switch>
          {channelRoutes()}
          <Route path="/">
            <TempFrontPage />
          </Route>
        </Switch>
      </Container>
    </Router>
  );
};

export default App;
