import React from 'react';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
  AudioTrack,
  LocalAudioTrack,
  LocalVideoTrack,
  VideoTrack,
} from 'twilio-video';

const useStyles = makeStyles(() =>
  createStyles({
    video: {
      width: '100%',
    },
  })
);

interface VideoProps {
  videoTrack?: VideoTrack | LocalVideoTrack | null;
  audioTrack?: AudioTrack | LocalAudioTrack | null;
  isMuted?: boolean;
}

const Video: React.FC<VideoProps> = ({ videoTrack, audioTrack, isMuted }) => {
  const classes = useStyles();

  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  React.useEffect(() => {
    if (videoTrack && videoRef.current) {
      videoTrack.attach(videoRef.current);
    }
  }, [videoRef, videoTrack]);

  React.useEffect(() => {
    if (audioTrack && audioRef.current) {
      audioTrack.attach(audioRef.current);
    }
  }, [audioRef, audioTrack]);

  return (
    <>
      <video className={classes.video} ref={videoRef} autoPlay playsInline />
      {audioTrack && <audio ref={audioRef} autoPlay muted={isMuted} />}
    </>
  );
};

export default React.memo(Video);
