import { Typography } from '@material-ui/core';
import React from 'react';
import { LobbyGamePlayer } from '../types';
import logger from '../utils/logger';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import InfoTooltip from '../components/GameCard/InfoTooltip';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    emailConfText: {
      marginBottom: theme.spacing(1),
    },
    dialogHighlights: {
      color: theme.palette.info.main,
    },
    registeringInfo: {
      marginBottom: theme.spacing(2),
    },
    tvLink: {
      fontSize: '1.5rem',
      fontFamily: 'BeautySchoolDropoutII',
      textTransform: 'uppercase',
    },
  })
);

interface ReservatioDataProps {
  data: LobbyGamePlayer;
  spectatorUrl?: string;
}

const ReservationData: React.FC<ReservatioDataProps> = ({
  data,
  spectatorUrl,
}) => {
  const classes = useStyles();

  const emailString = data.email ? ` ${data.email}` : '.';

  const getWordList = (words?: string[]) => {
    if (!words) {
      logger.error('no words set for locked player');

      return null;
    }

    return (
      <div className={classes.registeringInfo}>
        <Typography variant="body1">Tässä ovat pelin sanasi:</Typography>
        <Typography variant="body1" className={classes.dialogHighlights}>
          {words.join(', ')}
        </Typography>
      </div>
    );
  };

  const getGameUrl = (url?: string) => {
    if (!url) {
      logger.error('no inviteCode set for locked player');

      return null;
    }

    return (
      <div className={classes.registeringInfo}>
        <Typography variant="body1" color="initial">
          Peliin pääset liittymään osoitteessa:
        </Typography>
        <Typography variant="caption">{url}</Typography>
      </div>
    );
  };

  const spectatorInfo = () => {
    return spectatorUrl ? (
      <div className={classes.registeringInfo}>
        <Typography variant="body1" color="initial" className={classes.tvLink}>
          Kotipelit-TV
          <span>
            <InfoTooltip
              text={
                'Tätä peliä on mahdollista seurata livenä. Jos haluat pyytää ystäviäsi katsojiksi, jaa alla oleva linkki. Vain he, joille pelaajat ja juontaja jakavat linkin, näkevät pelin.'
              }
            />
          </span>
        </Typography>

        <Typography variant="caption">{spectatorUrl}</Typography>
      </div>
    ) : null;
  };

  return (
    <>
      {getWordList(data.privateData?.words)}
      {getGameUrl(data.url)}
      {spectatorInfo()}
      {/* <Typography variant="subtitle1" className={classes.tvLink}>
        Kotipelit-tv
      </Typography>
      <Typography variant="caption" color="initial">
        Tv-linkki tähän
      </Typography> */}
      {/** peruuta varaus-nappi? */}
      <Typography variant="body2" className={classes.emailConfText}>
        {`Jos et saanut viestiä osoitteeseen ${emailString}, kirjoita itsellesi ylläolevat tiedot muistiin.`}
        {/** Lähetä uudestaan -nappi, vaihda sposti-toiminto? */}
      </Typography>
    </>
  );
};

export default ReservationData;
