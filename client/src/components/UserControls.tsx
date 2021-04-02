import * as React from 'react';

import { logout } from '../reducers/user.reducer';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
  Link,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import { User } from '../types';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(() =>
  createStyles({
    flexUser: {
      display: 'flex',
      alignItems: 'center',
    },
  })
);

interface UserControlsProps {
  user: User;
}

const UserControls: React.FC<UserControlsProps> = ({ user }) => {
  const classes = useStyles();
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
      <Link onClick={handleClick}>Kirjaudu</Link>
    ) : null;

  const UserMenu = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleMenuClick = () => {
      // So far hard coded routing to profile
      history.push(`/${user.username}`);
      setAnchorEl(null);
    };

    return (
      <div>
        <IconButton
          aria-label="more"
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleOpen}
        >
          <AccountCircleIcon></AccountCircleIcon>
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={handleMenuClick}>Profiili</MenuItem>
          <MenuItem onClick={handleLogout}>
            <Typography variant="body1">Kirjaudu ulos</Typography>
          </MenuItem>
        </Menu>
      </div>
    );
  };

  return (
    <>
      <div className={classes.flexUser}>
        <Typography variant="body2">{user.username}</Typography>
        <UserMenu />
      </div>
    </>
  );
};

export default UserControls;
