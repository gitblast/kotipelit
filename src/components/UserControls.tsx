import * as React from 'react';

import { loginUser, logout } from '../reducers/user.reducer';

import { Typography, Button } from '@material-ui/core';

import { User } from '../types';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

interface UserControlsProps {
  user: User;
}

const UserControls: React.FC<UserControlsProps> = ({ user }) => {
  const dispatch = useDispatch();

  const history = useHistory();

  const handleLogin = () => {
    dispatch(loginUser('username', 'password'));
  };

  const handleLogout = () => {
    dispatch(logout());
    history.push('/');
  };

  if (!user || !user.loggedIn)
    return (
      <Button color="inherit" onClick={handleLogin}>
        <Typography>Kirjaudu</Typography>
      </Button>
    );

  return (
    <Button color="inherit" onClick={handleLogout}>
      <Typography>{`Kirjaa ulos ${user.username}`}</Typography>
    </Button>
  );
};

export default UserControls;
