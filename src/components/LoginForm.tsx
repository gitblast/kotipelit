import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  TextField,
  Fab,
  CircularProgress,
  Typography,
} from '@material-ui/core';
import { State } from '../types';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { loginUser } from '../reducers/user.reducer';
import { Redirect } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(2),
      color: theme.palette.primary.light,
      textAlign: 'center',
    },
    formField: {
      marginTop: theme.spacing(2),
    },
    inputStyle: {
      color: 'yellow',
    },
    section: {
      paddingTop: 40,
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
      <div className={classes.formField}>
        <TextField
          label="Käyttäjätunnus"
          variant="outlined"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
          className={classes.inputStyle}
        />
      </div>
      <div className={classes.formField}>
        <TextField
          label="Salasana"
          variant="outlined"
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <Fab
        className={classes.formField}
        variant="extended"
        onClick={handleLogin}
        color="primary"
      >
        {user.loggingIn ? <CircularProgress /> : 'Kirjaudu'}
      </Fab>

      <Typography variant="body1" className={classes.section}>
        Jos haluat alkaa järjestämään pelejä, ota yhteyttä info@kotipelit.com
        niin teemme sinulle käyttäjätilin.
      </Typography>
    </div>
  );
};

export default LoginForm;
