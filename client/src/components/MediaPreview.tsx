import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Video from './Video';
import AudioLevelIndicator from './AudioLevelIndicator';
import useLocalTracks from '../hooks/useLocalTracks';
import logger from '../utils/logger';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      maxWidth: 300,
    },
  })
);

const MediaPreview: React.FC = () => {
  const classes = useStyles();

  const {
    localVideoTrack,
    localAudioTrack,
    error: localTrackError,
  } = useLocalTracks(true);

  if (localTrackError) {
    logger.error(localTrackError);
  }

  return (
    <div className={classes.container}>
      <div>
        <Video videoTrack={localVideoTrack} />
        <AudioLevelIndicator audioTrack={localAudioTrack} />
      </div>
    </div>
  );
};

export default MediaPreview;
