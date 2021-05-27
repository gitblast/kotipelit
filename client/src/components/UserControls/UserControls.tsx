import { Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context';
import UserMenu from './UserMenu';

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

  const { user } = useUser();

  if (!user.loggedIn) {
    return (
      <Link to="/kirjaudu">
        <Typography variant="body2" color="primary">
          Kirjaudu
        </Typography>
      </Link>
    );
  }

  return (
    <>
      <div className={classes.flexUser}>
        <Typography variant="body2">{user.username}</Typography>
        <UserMenu user={user} />
      </div>
    </>
  );
};

export default UserControls;
