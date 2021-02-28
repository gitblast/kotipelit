import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Paper, Typography, Grid } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    footerContainer: {
      // Position absolute would be better if able to keep under the content && at the bottom of the page
      backgroundColor: 'rgb(96 80 52)',
      borderTop: 'solid 1px white',
      left: 0,
      bottom: 0,
      width: '100%',
      margin: 'auto',
      overflow: 'hidden',
    },
    footerContent: {
      display: 'flex',
      justifyContent: 'space-around',
      color: theme.palette.primary.light,
      marginTop: theme.spacing(1.5),
    },
    copyRights: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '60px',
      color: theme.palette.primary.light,
    },
    footerBlock: {
      [theme.breakpoints.down('xs')]: {
        textAlign: 'center',
      },
    },
    footerHeader: {
      color: 'black',
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
            <Typography className={classes.footerHeader}>Tuki</Typography>
            <Typography variant="body2">info[at]kotipelit.com</Typography>
            <Typography variant="body2">Usein kysyttyä</Typography>
          </Grid>
          <Grid item className={classes.footerBlock}>
            <Typography variant="body2" className={classes.footerHeader}>
              Spektaakkeli Events
            </Typography>
            <Typography variant="body2">Yleistä</Typography>
            <Typography variant="body2">Spektaakkeli.com</Typography>
            <Typography variant="body2">Kotiluennot.com</Typography>
          </Grid>
          <Grid item className={classes.footerBlock}>
            <Typography className={classes.footerHeader}>
              Yhteistyössä
            </Typography>
            <Typography variant="body2">Pallopelit.com</Typography>
          </Grid>
        </Grid>
        <Grid item className={classes.copyRights}>
          <Typography>&copy;</Typography>
          <Typography variant="body2">
            {`${new Date().getFullYear()} Spektaakkeli Events`}
          </Typography>
        </Grid>
      </Paper>
    </>
  );
};

export default Footer;
