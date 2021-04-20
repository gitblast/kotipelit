import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';

import KotitonniRulesBanner from './KotitonniRulesBanner';
import References from './References';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      margin: theme.spacing(4),
      '& > * + *': {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
      },
      [theme.breakpoints.down('sm')]: {
        textAlign: 'center',
        margin: theme.spacing(2),
      },
    },
    title: {
      textAlign: 'center',
      fontSize: '2rem',
      margin: theme.spacing(4),
    },
    neonDivider: {
      height: 3,
      background:
        'linear-gradient(to right, rgb(0 225 217), rgba(11, 43, 56, 1))',
      width: '75vw',
      alignSelf: 'center',
      marginTop: '6px',
    },
    gameSection: {
      display: 'flex',
      alignItems: 'center',
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
      },
    },
    gamePaper: {
      background: 'linear-gradient(to bottom, rgb(32 82 100), rgb(28 47 56))',
      maxWidth: 320,
      padding: theme.spacing(2),
      borderLeft: 'solid rgb(0 225 217)',
    },
    gameTitleBar: {
      display: 'flex',
      justifyContent: 'space-around',
    },
    topStyle: {
      borderTop: '14px dotted rgb(185 231 229)',
      background: 'rgb(103 136 129)',
      boxShadow: 'rgb(231 239 191) 1px 8px 44px',
      width: 64,
      alignSelf: 'center',
    },
    gameTitle: {
      fontFamily: 'BeautySchoolDropoutII',
      textTransform: 'uppercase',
      color: 'rgb(185 231 229)',
      fontSize: '3rem',
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
    },
    gameInfo: {
      margin: theme.spacing(2),
      textAlign: 'center',
      color: 'rgb(185 231 229)',
      '& > * + *': {
        marginTop: theme.spacing(2),
      },
    },
    gameInfoPara: {
      fontFamily: 'BeautySchoolDropoutII',
      textTransform: 'uppercase',
      fontSize: '2.3rem',
    },
    alv: {
      margin: 0,
      color: 'rgb(185 231 229)',
    },
    orderInfo: {
      margin: theme.spacing(2),
      '& > * + *': {
        marginTop: theme.spacing(4),
      },
    },
  })
);

const CompanyEvents = () => {
  const classes = useStyles();
  return (
    <>
      <div className={classes.container}>
        <Typography variant="h1" color="initial" className={classes.title}>
          Peli-illat yrityksille
        </Typography>
        <div className={classes.neonDivider}></div>
        <div className={classes.gameSection}>
          <Paper elevation={5} className={classes.gamePaper}>
            <div className={classes.gameTitleBar}>
              <div className={classes.topStyle}></div>
              <Typography
                variant="h2"
                color="initial"
                className={classes.gameTitle}
              >
                Kotitonni
              </Typography>
              <div className={classes.topStyle}></div>
            </div>
            <div className={classes.gameInfo}>
              <Typography
                variant="h3"
                color="initial"
                className={classes.gameInfoPara}
              >
                Kesto 45 - 60 min
              </Typography>
              <Typography
                variant="h3"
                color="initial"
                className={classes.gameInfoPara}
              >
                5 pelaajaa
              </Typography>
              <Typography
                variant="h3"
                color="initial"
                className={classes.gameInfoPara}
              >
                99€ per peli
              </Typography>
              <Typography
                variant="body2"
                color="initial"
                className={classes.alv}
              >
                Hintaan lisätään 24% alv
              </Typography>
            </div>
          </Paper>
          <div className={classes.orderInfo}>
            <Typography variant="body1" color="initial">
              Peli pelataan Kotipelien pelaamiseen kustomoidulla
              videopuhelualustalla.
            </Typography>
            <Typography variant="body1" color="initial">
              Hinta sisältää kokeneen pelijuontajan tuomaan gameshow- tunnelmaa
              peli-iltaanne.
            </Typography>
            <Typography variant="body1" color="initial">
              Ottakaa yhteyttä info [at] kotipelit.com ja viemme työntekijänne
              viihteelle!
            </Typography>
          </div>
        </div>
        <div className={classes.neonDivider}></div>
        <KotitonniRulesBanner />
        <References />
      </div>
    </>
  );
};

export default CompanyEvents;
