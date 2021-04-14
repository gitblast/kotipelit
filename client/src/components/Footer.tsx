import React from 'react';

import { Link } from 'react-router-dom';

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
      color: theme.palette.primary.light,
      marginTop: theme.spacing(1.5),
      textAlign: 'center',
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
        <Grid container spacing={4} className={classes.footerContent}>
          <Grid item md={4} xs={12} className={classes.footerBlock}>
            <Typography variant="body2" className={classes.footerHeader}>
              Tuki
            </Typography>
            <Typography variant="body2">info[at]kotipelit.com</Typography>
            <Typography variant="body2" component={Link} to="/kysyttya">
              Usein kysyttyä
            </Typography>
          </Grid>
          <Grid item md={4} xs={12} className={classes.footerBlock}>
            <Typography variant="body2" className={classes.footerHeader}>
              Spektaakkeli Events
            </Typography>
            <Typography variant="body2" component={Link} to="/yleista">
              Yleistä
            </Typography>
            <Typography variant="body2">Spektaakkeli.com</Typography>
            <Typography variant="body2">Kotiluennot.com</Typography>
          </Grid>
          <Grid item md={4} xs={12} className={classes.footerBlock}>
            <Typography variant="body2" className={classes.footerHeader}>
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
