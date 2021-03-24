import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  TextField,
  CircularProgress,
  Typography,
  Button,
  Paper,
} from '@material-ui/core';
import { State } from '../types';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { loginUser } from '../reducers/user.reducer';
import { Redirect } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      margin: theme.spacing(2),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    loginField: {
      padding: theme.spacing(3),
      maxWidth: 350,
      color: theme.palette.primary.light,
      textAlign: 'center',
      margin: theme.spacing(2),
    },
  })
);

const LoginForm: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  const user = useSelector((state: State) => state.user, shallowEqual);

  const handleLogin = () => {
    dispatch(loginUser(username, password));
  };

  if (user.loggedIn) {
    return <Redirect to={`/${user.username}`} />;
  }

  return (
    <div className={classes.container}>
      <Paper elevation={3} className={classes.loginField}>
        <div>
          <TextField
            variant="outlined"
            label="Käyttäjätunnus"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <TextField
            variant="outlined"
            label="Salasana"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <Button onClick={handleLogin} color="secondary">
          {user.loggingIn ? <CircularProgress /> : 'Kirjaudu'}
        </Button>
      </Paper>
      <Typography variant="body2">
        Jos haluat alkaa järjestämään pelejä, ota yhteyttä info@kotipelit.com
        niin teemme sinulle käyttäjätilin.
      </Typography>
    </div>
  );
};

export default LoginForm;
