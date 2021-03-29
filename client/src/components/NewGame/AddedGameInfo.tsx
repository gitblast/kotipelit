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
    shareLink: {
      color: theme.palette.success.main,
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
      <Typography variant="subtitle2" color="initial">
        Kotipelit
      </Typography>
      <Typography variant="caption">{`${baseUrl}/${username}/kutsut/${addedGame.id}`}</Typography>
      <Typography className={classes.shareLink}>
        Jaa ylläoleva linkki kaikille, jotka haluat kutsua pelaamaan.
      </Typography>

      {addedGame.allowedSpectators !== 0 ? (
        <>
          <Typography variant="subtitle1" color="initial">
            Kotipelit-TV
          </Typography>
          <Typography variant="caption">
            {`${baseUrl}/${username}/live/${addedGame.id}`}
          </Typography>
          <Typography className={classes.shareLink}>
            Jaa tämä kaikille, jotka haluat kutsua katsojiksi
          </Typography>
        </>
      ) : null}
    </div>
  );
};

export default AddedGameInfo;
