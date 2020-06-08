import React from 'react';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import { Button, Container } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import ChannelPage from './components/channel/ChannelPage';

const useStyles = makeStyles((theme: Theme) => createStyles({}));

const App = () => {
  const classes = useStyles();

  return (
    <Router>
      <Container>
        <Button variant="contained" component={Link} to={'/matleena'}>
          Matleena
        </Button>
        <Switch>
          <Route path="/matleena">
            <ChannelPage labelText="Matun kanava" />
          </Route>
        </Switch>
      </Container>
    </Router>
  );
};

export default App;
