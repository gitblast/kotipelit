import React from 'react';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    footerContainer: {
      // Position absolute would be better if able to keep under the content && at the bottom of the page
      backgroundColor: 'rgba(129,129,129)',
      left: 0,
      bottom: 0,
      width: '100%',
    },
    footer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      color: 'white',
      height: '60px',
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
