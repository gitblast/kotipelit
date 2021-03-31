import React from 'react';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import Video from './Video';
import AudioLevelIndicator from './AudioLevelIndicator';
import DeviceSelector from './DeviceSelector';
import useLocalTracks from '../hooks/useLocalTracks';

import {
  SAVED_AUDIO_DEVICE_ID,
  SAVED_VIDEO_DEVICE_ID,
  DEFAULT_VIDEO_CONSTRAINTS,
  DEFAULT_AUDIO_CONSTRAINTS,
} from '../constants';
import useDevices from '../hooks/useDevices';
import Loader from './Loader';

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      maxWidth: 300,
      minWidth: 300,
    },
  })
);

const MediaPreview: React.FC = () => {
  const classes = useStyles();

  const {
    localVideoTrack,
    localAudioTrack,
    shutDownLocalTracks,
  } = useLocalTracks(true);

  const { audioInputDevices, videoInputDevices } = useDevices(
    !!localAudioTrack || !!localVideoTrack
  );

  React.useEffect(() => {
    return shutDownLocalTracks;
  }, [shutDownLocalTracks]);

  const handleAudioTrackChange = React.useCallback(
    (newDeviceId: string) => {
      window.localStorage.setItem(SAVED_AUDIO_DEVICE_ID, newDeviceId);

      localAudioTrack?.restart({
        ...DEFAULT_AUDIO_CONSTRAINTS,
        deviceId: { exact: newDeviceId },
      });
    },
    [localAudioTrack]
  );

  const handleVideoTrackChange = React.useCallback(
    (newDeviceId: string) => {
      window.localStorage.setItem(SAVED_VIDEO_DEVICE_ID, newDeviceId);

      localVideoTrack?.restart({
        ...DEFAULT_VIDEO_CONSTRAINTS,
        deviceId: { exact: newDeviceId },
      });
    },
    [localVideoTrack]
  );

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
