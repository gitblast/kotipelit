import * as React from 'react';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Typography, IconButton, Menu, MenuItem } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import { useHistory, Link } from 'react-router-dom';
import { useUser } from '../context';

const useStyles = makeStyles(() =>
  createStyles({
    flexUser: {
      display: 'flex',
      alignItems: 'center',
    },
  })
);

const UserControls = () => {
  const classes = useStyles();
  const history = useHistory();

  const { user, logout } = useUser();

  const handleLogout = () => {
    logout();

    history.push('/');
  };

  if (!user.loggedIn) {
    return (
      <Link to="/kirjaudu">
        <Typography variant="body2" color="primary">
          Kirjaudu
        </Typography>
      </Link>
    );
  }

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
