import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { RTCGame } from '../../types';
import { Typography } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(1),
    },
    tvLink: {
      fontSize: '2rem',
      color: theme.palette.info.main,
    },
    gameInfo: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      [theme.breakpoints.down('xs')]: {
        maxWidth: 200,
      },
    },
  })
);

interface AddedGameInfoProps {
  addedGame: RTCGame | null;
  error: string | null;
}

const AddedGameInfo = ({ addedGame, error }: AddedGameInfoProps) => {
  const classes = useStyles();

  const username = useParams<{ username: string }>().username;

  if (!addedGame) {
    return error ? (
      <div className={classes.container}>
        <Typography>{`Virhe pelin lisäämisessä: ${error}`}</Typography>
      </div>
    ) : (
      <CircularProgress />
    );
  }

  const baseUrl =
    // eslint-disable-next-line no-undef
    process && process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://www.kotipelit.com';

  return (
    <div className={classes.container}>
      <div className={classes.gameInfo}>
        <Typography variant="body1">
          Jaa tämä peliaulan linkki kaikille, jotka haluat kutsua pelaamaan:
        </Typography>
        <Typography variant="caption">{`${baseUrl}/${username}/kutsut/${addedGame.id}`}</Typography>
      </div>
      {/* {addedGame.allowedSpectators !== 0 ? (
        <div className={classes.gameInfo}>
          <Typography variant="body1" color="initial">
            Jaa tämä vain katsojille:
          </Typography>
          <Typography variant="caption">
            {`${baseUrl}/${username}/live/${addedGame.id}`}
          </Typography>
        </div>
      ) : null} */}
    </div>
  );
};

export default AddedGameInfo;
