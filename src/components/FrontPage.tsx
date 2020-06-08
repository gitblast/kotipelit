import React from 'react';

import { Link } from 'react-router-dom';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Typography, Button } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: { padding: theme.spacing(2), textAlign: 'center' },
    linkContainer: { marginTop: theme.spacing(2) },
  })
);

// interface FrontPageProps {}

const FrontPage: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div>
        <Typography variant="h3">Kanavat:</Typography>
      </div>
      <div className={classes.linkContainer}>
        <Button component={Link} to="/matleena" variant="outlined">
          Matleena
        </Button>
      </div>
      <div className={classes.linkContainer}>
        <Button component={Link} to="/matleena" variant="outlined">
          Batleena
        </Button>
      </div>
      <div className={classes.linkContainer}>
        <Button component={Link} to="/matleena" variant="outlined">
          Catleena
        </Button>
      </div>
    </div>
  );
};

export default FrontPage;
