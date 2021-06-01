import React from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    pointsRow: {
      display: 'flex',
      justifyContent: 'space-around',
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
      },
    },
    pointBlock: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    points: {
      fontFamily: 'BeautySchoolDropoutII',
      fontSize: '3rem',
      color: 'rgb(41 174 170)',
    },
    pointsWrong: {
      color: 'rgb(171 34 186)',
    },
  })
);

const KotitonniPointsInfo = () => {
  const classes = useStyles();
  return (
    <div className={classes.pointsRow}>
      <div className={classes.pointBlock}>
        <Typography variant="body1" color="initial">
          1 oikein:
        </Typography>
        <Typography variant="body1" color="initial" className={classes.points}>
          100
        </Typography>
      </div>
      <div className={classes.pointBlock}>
        <Typography variant="body1" color="initial">
          2 oikein:
        </Typography>
        <Typography variant="body1" color="initial" className={classes.points}>
          30
        </Typography>
      </div>
      <div className={classes.pointBlock}>
        <Typography variant="body1" color="initial">
          3 oikein:
        </Typography>
        <Typography variant="body1" color="initial" className={classes.points}>
          10
        </Typography>
      </div>
      <div className={classes.pointBlock}>
        <Typography variant="body1" color="initial">
          0 tai kaikki oikein:
        </Typography>
        <Typography
          variant="body1"
          color="initial"
          className={`${classes.points} ${classes.pointsWrong}`}
        >
          -50
        </Typography>
      </div>
    </div>
  );
};

export default KotitonniPointsInfo;
