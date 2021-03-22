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
      <Typography>{`${baseUrl}/${username}/kutsut/${addedGame.id}`}</Typography>
      <Typography>Jaa tämä linkki pelaajille</Typography>

      {addedGame.allowedSpectators && (
        <>
          <Typography>
            {`${baseUrl}/${username}/live/${addedGame.id}`}
          </Typography>
          <Typography>Jaa tämä linkki katsojille</Typography>
        </>
      )}
    </div>
  );
};

export default AddedGameInfo;
