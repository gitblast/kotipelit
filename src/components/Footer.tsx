import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Paper, Typography, Grid } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    footerContainer: {
      // Position absolute would be better if able to keep under the content && at the bottom of the page
      backgroundColor: 'rgb(59 98 104)',
      left: 0,
      bottom: 0,
      marginTop: theme.spacing(8),
      width: '100%',
    },
    footerContent: {
      display: 'flex',
      justifyContent: 'space-around',
      color: 'white',
    },
    copyRights: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      height: '60px',
    },
    footerBlock: {
      [theme.breakpoints.down('xs')]: {
        textAlign: 'center',
      },
    },
  })
);

const Footer: React.FC = () => {
  const classes = useStyles();
  return (
    <>
      <Paper className={classes.footerContainer}>
        <Grid container spacing={6} className={classes.footerContent}>
          <Grid item className={classes.footerBlock}>
            <Typography variant="body2">Tuki</Typography>
            <Typography>Ota yhteyttä</Typography>
            <Typography>Usein kysyttyä</Typography>
          </Grid>
          <Grid item className={classes.footerBlock}>
            <Typography variant="body2">Spektaakkeli Events</Typography>
            <Typography>Yleistä</Typography>
            <Typography>Spektaakkeli.com</Typography>
            <Typography>Kotiluennot.com</Typography>
          </Grid>
          <Grid item className={classes.footerBlock}>
            <Typography variant="body2">Yhteistyössä</Typography>
            <Typography></Typography>
            <Typography>Pallopelit.com</Typography>
          </Grid>
        </Grid>
        <Grid item className={classes.copyRights}>
          <Typography>&copy;</Typography>
          <Typography>
            {`${new Date().getFullYear()} Spektaakkeli Events`}
          </Typography>
        </Grid>
      </Paper>
    </>
  );
};

export default Footer;
