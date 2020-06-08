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

import FrontPage from './components/FrontPage';
import ChannelPage from './components/channel/ChannelPage';
import NewGame from './components/channel/host/NewGame';

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

  return (
    <Router>
      <AppBar position="static" className={classes.navbar}>
        <Toolbar className={classes.toolbar}>
          <Button color="inherit" component={Link} to="/">
            <Typography variant="h6">Kotipelit.com</Typography>
          </Button>
          <Button color="inherit">
            <Typography>Kirjaudu</Typography>
          </Button>
        </Toolbar>
      </AppBar>
      <Container>
        <Switch>
          <Route path="/:username/newgame">
            <NewGame />
          </Route>
          <Route path="/matleena">
            <ChannelPage labelText="Matun kanava" />
          </Route>
          <Route path="/">
            <FrontPage />
          </Route>
        </Switch>
      </Container>
    </Router>
  );
};

export default App;
