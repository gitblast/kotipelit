import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { CircularProgress, Typography, Button } from '@material-ui/core';
import { RTCGame } from '../../types';
import { useParams, useHistory } from 'react-router';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    resetContainer: {
      marginTop: theme.spacing(6),
      marginLeft: theme.spacing(6),
      marginRight: theme.spacing(6),
      [theme.breakpoints.down('sm')]: {
        margin: 0,
        width: '90%',
      },
    },
  })
);

interface BottomContentProps {
  errors: string[];
  loading: boolean;
  addedGame: RTCGame | null;
}

const BottomContent: React.FC<BottomContentProps> = ({
  errors,
  loading,
  addedGame,
}) => {
  const classes = useStyles();
  const username = useParams<{ username: string }>();

  const history = useHistory();
  /**
   * Redirects back to host main page
   */
  const handleReturn = (): void => {
    history.push(`/${username}`);
  };

  if (errors.length) {
    return (
      <div>
        {errors.map((e) => (
          <div key={e}>{e}</div>
        ))}
      </div>
    );
  }

  if (loading) {
    return <CircularProgress />;
  }

  if (addedGame) {
    const baseUrl =
      // eslint-disable-next-line no-undef
      process && process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : 'https://www.kotipelit.com';

    return (
      <div className={classes.resetContainer}>
        <Typography variant="caption">{`${baseUrl}/${username}/kutsut/${addedGame.id}`}</Typography>
        <Typography variant="body1">
          Jaa ylläoleva peliaulan linkki henkilöille, jotka haluat kutsua
          pelaamaan.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleReturn}>
          Oma profiili
        </Button>
        {/* How to include game id?  */}
        {/* <Button
            variant="contained"
            color="secondary"
            component={Link}
            to={`/${username}/kutsut/${game.id}`}
          >
            Peliaula
          </Button> */}
      </div>
    );
  }

  return (
    <div>
      <Typography>Odottamaton virhe peliä lisätessä</Typography>
    </div>
  );
};

export default BottomContent;
