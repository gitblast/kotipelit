import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    footerContainer: {
      // Position absolute would be better if able to keep under the content && at the bottom of the page
      position: 'fixed',
      left: 0,
      bottom: 0,
      width: '100%',
      height: '45px',
    },
    footer: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: 'white',
      backgroundColor: 'rgba(129,129,129)',
      height: 45,
    },
  })
);

const Footer: React.FC = () => {
  const classes = useStyles();
  return (
    <>
      <Paper className={classes.footerContainer}>
        <Typography className={classes.footer} variant="body2">
          &copy; 2020 Spektaakkeli Events
        </Typography>
      </Paper>
    </>
  );
};

export default Footer;
