import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Link, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(3),
      textAlign: 'center',
    },
  })
);

const BrowserNotSupported: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Typography>
        Käyttämääsi selainta ei tueta. Näet tuetut selaimet{' '}
        <Link
          href="https://www.twilio.com/docs/video/javascript#supported-browsers"
          target="_blank"
          rel="noopener"
        >
          täältä
        </Link>
      </Typography>
    </div>
  );
};

export default BrowserNotSupported;
