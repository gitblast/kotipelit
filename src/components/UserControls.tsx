import * as React from 'react';

import { logout } from '../reducers/user.reducer';

import { Typography, Button } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import { State, User } from '../types';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

interface UserControlsProps {
  user: User;
}

const UserControls: React.FC<UserControlsProps> = ({ user }) => {
  const dispatch = useDispatch();
  const gameRunning = useSelector((state: State) => !!state.rtc.game);
  const history = useHistory();

  const handleClick = () => {
    if (
      gameRunning &&
      !window.confirm(
        'Tämä katkaisee yhteyden meneillään olevaan peliin. Haluatko silti jatkaa?'
      )
    ) {
      return;
    }

    history.push('/kirjaudu');
  };

  const handleLogout = () => {
    dispatch(logout());

    if (!gameRunning) {
      history.push('/');
    }
  };

  if (!user.loggedIn)
    return history.location.pathname !== '/kirjaudu' ? (
      <Button color="inherit" onClick={handleClick}>
        <Typography>
          Kirjaudu<AccountCircleIcon></AccountCircleIcon>
        </Typography>
      </Button>
    ) : null;

  return (
    <Button color="inherit" onClick={handleLogout}>
      <Typography>{`Kirjaa ulos ${user.username}`}</Typography>
    </Button>
  );
};

export default UserControls;
