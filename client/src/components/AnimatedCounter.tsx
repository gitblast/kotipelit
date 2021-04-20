import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    playerPoints: {
      fontFamily: 'beautySchoolDropoutII',
      fontSize: '2.1rem',
      color: 'rgb(0 225 217)',
      [theme.breakpoints.down('sm')]: {
        fontSize: '1.1rem',
      },
    },
  })
);

interface AnimatedCounterProps {
  currentValue: number;
}

const INTERVAL_MS = 20;

const AnimatedCounter = ({ currentValue }: AnimatedCounterProps) => {
  const classes = useStyles();

  const [displayedValue, setDisplayedValue] = React.useState(currentValue);

  React.useEffect(() => {
    const diff = currentValue - displayedValue;

    if (diff !== 0) {
      const incrementDisplayed = currentValue > displayedValue;

      setTimeout(
        () =>
          setDisplayedValue((current) => {
            return incrementDisplayed ? current + 1 : current - 1;
          }),
        INTERVAL_MS
      );
    }
  }, [currentValue, displayedValue]);

  return <div className={classes.playerPoints}>{displayedValue}</div>;
};

export default AnimatedCounter;
