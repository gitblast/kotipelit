import * as React from 'react';

import { logout } from '../reducers/user.reducer';

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

  const handleLogout = () => {
    dispatch(logout());
    history.push('/');
  };

  if (!user.loggedIn)
    return history.location.pathname !== '/kirjaudu' ? (
      <Button color="inherit" onClick={() => history.push('/kirjaudu')}>
        <Typography>Kirjaudu</Typography>
      </Button>
    ) : null;

  return (
    <Button color="inherit" onClick={handleLogout}>
      <Typography>{`Kirjaa ulos ${user.username}`}</Typography>
    </Button>
  );
};

export default UserControls;
