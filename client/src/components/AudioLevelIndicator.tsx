import React, { useEffect, useState } from 'react';
import {
  AudioTrack,
  VideoTrack,
  LocalVideoTrack,
  LocalAudioTrack,
  RemoteAudioTrack,
  RemoteVideoTrack,
} from 'twilio-video';
import { interval } from 'd3-timer';
import { LinearProgress, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

type TrackType =
  | LocalAudioTrack
  | LocalVideoTrack
  | RemoteAudioTrack
  | RemoteVideoTrack
  | null;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      border: `1px solid rgba(0, 0, 0, 0.44)`,
      borderRadius: 5,
      padding: theme.spacing(1),
      display: 'flex',
      alignItems: 'center',
    },
    barContainer: {
      flex: 1,
    },
    bar: {
      transition: 'none',
    },
  })
);

const useIsTrackEnabled = (track: TrackType) => {
  const [isEnabled, setIsEnabled] = useState(track ? track.isEnabled : false);

  useEffect(() => {
    setIsEnabled(track ? track.isEnabled : false);

    if (track) {
      const setEnabled = () => setIsEnabled(true);
      const setDisabled = () => setIsEnabled(false);
      track.on('enabled', setEnabled);
      track.on('disabled', setDisabled);
      return () => {
        track.off('enabled', setEnabled);
        track.off('disabled', setDisabled);
      };
    }
  }, [track]);

  return isEnabled;
};

/*
 * This hook allows components to reliably use the 'mediaStreamTrack' property of
 * an AudioTrack or a VideoTrack. Whenever 'localTrack.restart(...)' is called, it
 * will replace the mediaStreamTrack property of the localTrack, but the localTrack
 * object will stay the same. Therefore this hook is needed in order for components
 * to rerender in response to the mediaStreamTrack changing.
 */
const useMediaStreamTrack = (track: AudioTrack | VideoTrack | null) => {
  const [mediaStreamTrack, setMediaStreamTrack] = useState(
    track?.mediaStreamTrack
  );

  useEffect(() => {
    setMediaStreamTrack(track?.mediaStreamTrack);

    if (track) {
      const handleStarted = () => setMediaStreamTrack(track.mediaStreamTrack);
      track.on('started', handleStarted);
      return () => {
        track.off('started', handleStarted);
      };
    }
  }, [track]);

  return mediaStreamTrack;
};

const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioContext: AudioContext;

export function initializeAnalyser(stream: MediaStream) {
  audioContext = audioContext || new AudioContext();
  const audioSource = audioContext.createMediaStreamSource(stream);

  const analyser = audioContext.createAnalyser();
  analyser.smoothingTimeConstant = 0.2;
  analyser.fftSize = 256;

  audioSource.connect(analyser);
  return analyser;
}

interface AudioLevelIndicatorProps {
  audioTrack: LocalAudioTrack | null;
}

const AudioLevelIndicator: React.FC<AudioLevelIndicatorProps> = ({
  audioTrack,
}) => {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [analyser, setAnalyser] = useState<AnalyserNode>();
  const isTrackEnabled = useIsTrackEnabled(
    audioTrack as LocalAudioTrack | RemoteAudioTrack
  );
  const mediaStreamTrack = useMediaStreamTrack(audioTrack);

  useEffect(() => {
    if (audioTrack && mediaStreamTrack && isTrackEnabled) {
      // Here we create a new MediaStream from a clone of the mediaStreamTrack.
      // A clone is created to allow multiple instances of this component for a single
      // AudioTrack on iOS Safari.
      let newMediaStream = new MediaStream([mediaStreamTrack.clone()]);

      // Here we listen for the 'stopped' event on the audioTrack. When the audioTrack is stopped,
      // we stop the cloned track that is stored in 'newMediaStream'. It is important that we stop
      // all tracks when they are not in use. Browsers like Firefox don't let you create a new stream
      // from a new audio device while the active audio device still has active tracks.
      const stopAllMediaStreamTracks = () =>
        newMediaStream.getTracks().forEach((track) => track.stop());
      audioTrack.on('stopped', stopAllMediaStreamTracks);

      const reinitializeAnalyser = () => {
        stopAllMediaStreamTracks();
        newMediaStream = new MediaStream([mediaStreamTrack.clone()]);
        setAnalyser(initializeAnalyser(newMediaStream));
      };

      setAnalyser(initializeAnalyser(newMediaStream));

      // Here we reinitialize the AnalyserNode on focus to avoid an issue in Safari
      // where the analysers stop functioning when the user switches to a new tab
      // and switches back to the app.
      window.addEventListener('focus', reinitializeAnalyser);

      return () => {
        stopAllMediaStreamTracks();
        window.removeEventListener('focus', reinitializeAnalyser);
        audioTrack.off('stopped', stopAllMediaStreamTracks);
      };
    }
  }, [isTrackEnabled, mediaStreamTrack, audioTrack]);

  useEffect(() => {
    console.log('render');
    if (isTrackEnabled && analyser) {
      const sampleArray = new Uint8Array(analyser.frequencyBinCount);

      const timer = interval(() => {
        analyser.getByteFrequencyData(sampleArray);
        let values = 0;

        const length = sampleArray.length;
        for (let i = 0; i < length; i++) {
          values += sampleArray[i];
        }

        const newValue = (values / length / 255) * 100.0;

        setValue(newValue);
      }, 100);

      return () => {
        timer.stop();
      };
    }
  }, [isTrackEnabled, analyser]);

  return (
    <div className={classes.container}>
      <div className={classes.barContainer}>
        <LinearProgress
          color="secondary"
          variant="determinate"
          value={value}
          classes={{ bar: classes.bar }} // disbles laggy animation when updating
        />
      </div>
      <div>
        <Typography variant="body2">{Math.round(value)} %</Typography>
      </div>
    </div>
  );
};

export default React.memo(AudioLevelIndicator);
