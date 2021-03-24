import React from 'react';

import TvIcon from '@material-ui/icons/Tv';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      alignItems: 'center',
    },
    text: {
      marginLeft: theme.spacing(1),
    },
  })
);

interface SpectatorCountProps {
  count: number;
}

const SpectatorCount = ({ count }: SpectatorCountProps) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <TvIcon />
      <Typography className={classes.text} variant="body2" color="initial">
        {count}
      </Typography>
    </div>
  );
};

export default SpectatorCount;
