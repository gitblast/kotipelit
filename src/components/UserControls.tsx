import * as React from 'react';

import { logout } from '../reducers/user.reducer';

import { Link } from '@material-ui/core';
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
      <Link onClick={handleClick}>
        Kirjaudu<AccountCircleIcon></AccountCircleIcon>
      </Link>
    ) : null;

  return <Link onClick={handleLogout}>{`Kirjaa ulos ${user.username}`}</Link>;
};

export default UserControls;
