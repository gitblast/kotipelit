import { Typography } from '@material-ui/core';
import React from 'react';
import { LobbyGamePlayer } from '../types';
import logger from '../utils/logger';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    emailConfText: {
      marginBottom: theme.spacing(1),
    },
    tvLink: {
      fontSize: '2rem',
      color: theme.palette.info.main,
    },
  })
);

interface ReservatioDataProps {
  data: LobbyGamePlayer;
}

const ReservationData: React.FC<ReservatioDataProps> = ({ data }) => {
  const classes = useStyles();

  const emailString = data.email ? ` (${data.email})` : '.';

  const getWordList = (words?: string[]) => {
    if (!words) {
      logger.error('no words set for locked player');

      return null;
    }

    return (
      <>
        <Typography variant="body2">Tässä ovat pelin sanasi:</Typography>
        <Typography>{words.join(', ')}</Typography>
      </>
    );
  };

  const getGameUrl = (url?: string) => {
    if (!url) {
      logger.error('no inviteCode set for locked player');

      return null;
    }

    return (
      <>
        <Typography variant="body2">
          Peliin pääset liittymään osoitteessa:
        </Typography>
        <Typography variant="caption">{url}</Typography>
      </>
    );
  };

  return (
    <>
      <Typography variant="body1">
        {`Lähetimme pelin tiedot sähköpostiisi${emailString}`}
        {/** Lähetä uudestaan -nappi, vaihda sposti-toiminto? */}
      </Typography>
      <Typography variant="body2" className={classes.emailConfText}>
        Jos et saanut viestiä, kirjoita itsellesi alla olevat tiedot muistiin.
      </Typography>
      {getWordList(data.privateData?.words)}
      {getGameUrl(data.url)}
      {/* <Typography variant="subtitle1" className={classes.tvLink}>
        Kotipelit-tv
      </Typography>
      <Typography variant="caption" color="initial">
        Tv-linkki tähän
      </Typography> */}
      {/** peruuta varaus-nappi? */}
    </>
  );
};

export default ReservationData;
