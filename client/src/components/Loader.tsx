import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { LinearProgress } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    centered: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      /// Undefined color (neon)
      color: 'rgb(185 231 229)',
      marginTop: theme.spacing(3),
    },
    root: {
      width: '30%',
      height: 2,
      marginBottom: theme.spacing(3),
      [theme.breakpoints.down('sm')]: {
        width: '90%',
      },
    },
  })
);

interface LoaderProps {
  msg: string;
  spinner?: boolean;
  errored?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ msg, spinner, errored }) => {
  const classes = useStyles();
  const [progress, setProgress] = React.useState(25);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 25;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className={classes.centered}>
      {errored ? (
        <Typography color="error">Tapahtui virhe</Typography>
      ) : (
        <>
          <Typography
            variant="body2"
            className={classes.loadingText}
            gutterBottom
          >
            {msg}
          </Typography>
          {spinner && (
            <div className={classes.root}>
              <LinearProgress variant="determinate" value={progress} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Loader;
