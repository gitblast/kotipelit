import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import logoImg from '../assets/images/logoTransparent.png';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

import UserControls from './UserControls/UserControls';
import { useUser } from '../context';
import LanguageSelect from './LanguageSelect';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    navbar: {
      // marginBottom: theme.spacing(3),
      // maxWidth: 1230,
      margin: 'auto',
      backgroundColor: 'rgba(11, 43, 56, 1)',
      minHeight: '9vh',
      color: 'black',
    },
    logo: {
      maxHeight: 52,
      width: 'auto',
      marginTop: theme.spacing(0.5),
    },
    toolbar: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    registerLink: {
      marginLeft: theme.spacing(1),
      underline: 'none',
    },
    flex: {
      display: 'flex',
    },
  })
);

// interface TopBarProps {}

const TopBar = () => {
  const classes = useStyles();

  const { user } = useUser();

  return (
    <AppBar position="static" className={classes.navbar}>
      <Toolbar className={classes.toolbar}>
        <Link to="/" className={classes.logo}>
          <img className={classes.logo} src={logoImg} alt="Kotipelit" />
        </Link>
        <div className={classes.flex}>
          <LanguageSelect />
          <UserControls />
          {!user.loggedIn && (
            <div className={classes.registerLink}>
              <Link to="/rekisteroidy">
                <Typography variant="body2">Luo tili</Typography>
              </Link>
            </div>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
