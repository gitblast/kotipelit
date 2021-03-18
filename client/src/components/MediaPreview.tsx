import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Video from './Video';
import AudioLevelIndicator from './AudioLevelIndicator';
import DeviceSelector from './DeviceSelector';
import useLocalTracks from '../hooks/useLocalTracks';
import logger from '../utils/logger';

import { SAVED_AUDIO_DEVICE_ID, SAVED_VIDEO_DEVICE_ID } from '../constants';
import useDevices from '../hooks/useDevices';
import Loader from './Loader';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      maxWidth: 300,
      minWidth: 300,
    },
  })
);

const MediaPreview: React.FC = () => {
  const classes = useStyles();

  const { audioInputDevices, videoInputDevices } = useDevices();

  const {
    localVideoTrack,
    localAudioTrack,
    shutDownLocalTracks,
    error: localTrackError,
  } = useLocalTracks(true);

  React.useEffect(() => {
    return shutDownLocalTracks;
  }, [shutDownLocalTracks]);

  const handleAudioTrackChange = React.useCallback(
    (newDeviceId: string) => {
      window.localStorage.setItem(SAVED_AUDIO_DEVICE_ID, newDeviceId);

      localAudioTrack?.restart({ deviceId: { exact: newDeviceId } });
    },
    [localAudioTrack]
  );

  const handleVideoTrackChange = React.useCallback(
    (newDeviceId: string) => {
      window.localStorage.setItem(SAVED_VIDEO_DEVICE_ID, newDeviceId);

      localVideoTrack?.restart({ deviceId: { exact: newDeviceId } });
    },
    [localVideoTrack]
  );

  if (localTrackError) {
    logger.error(localTrackError);
  }

  if (
    !localVideoTrack ||
    !localAudioTrack ||
    !audioInputDevices ||
    !videoInputDevices
  ) {
    return (
      <div className={classes.container}>
        <Loader msg={'Ladataan...'} spinner />
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <Video videoTrack={localVideoTrack} />
      <AudioLevelIndicator audioTrack={localAudioTrack} />
      <div>
        <DeviceSelector
          currentDeviceId={
            localAudioTrack?.mediaStreamTrack.getSettings().deviceId ?? null
          }
          handleTrackChange={handleAudioTrackChange}
          mediaDevices={audioInputDevices}
          mediaType="audio"
        />
      </div>
      <div>
        <DeviceSelector
          currentDeviceId={
            localVideoTrack?.mediaStreamTrack.getSettings().deviceId ?? null
          }
          handleTrackChange={handleVideoTrackChange}
          mediaDevices={videoInputDevices}
          mediaType="video"
        />
      </div>
    </div>
  );
};

export default MediaPreview;
