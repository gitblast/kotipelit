import * as React from 'react';

import { logout } from '../reducers/user.reducer';

import { Typography, Button } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import { User } from '../types';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

interface UserControlsProps {
  user: User;
}

const UserControls: React.FC<UserControlsProps> = ({ user }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const handleClick = () => {
    history.push('/kirjaudu');
  };

  const handleLogout = () => {
    dispatch(logout());

    history.push('/');
  };

  if (!user.loggedIn)
    return history.location.pathname !== '/kirjaudu' ? (
      <Button color="inherit" onClick={handleClick}>
        <Typography color="primary" variant="body2">
          Kirjaudu<AccountCircleIcon></AccountCircleIcon>
        </Typography>
      </Button>
    ) : null;

  return (
    <Button onClick={handleLogout}>
      <Typography
        color="primary"
        variant="body2"
      >{`Kirjaa ulos ${user.username}`}</Typography>
    </Button>
  );
};

export default UserControls;
