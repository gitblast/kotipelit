import React from 'react';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import { AudioTrack, VideoTrack } from 'twilio-video';

const useStyles = makeStyles(() =>
  createStyles({
    absolute: {
      width: '100%',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  })
);

interface VideoProps {
  videoTrack: VideoTrack;
  // audioTrack: AudioTrack;
  isMuted: boolean;
}

const Video: React.FC<VideoProps> = ({ videoTrack, isMuted }) => {
  const classes = useStyles();

  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  React.useEffect(() => {
    if (videoRef.current) {
      videoTrack.attach(videoRef.current);
    }
  }, [videoRef, videoTrack]);

  /* React.useEffect(() => {
    if (audioRef.current) {
      audioTrack.attach(audioRef.current);
    }
  }, [audioRef, audioTrack]); */

  return (
    <>
      <video className={classes.absolute} ref={videoRef} autoPlay playsInline />
      {/* <audio ref={audioRef} autoPlay muted={isMuted} /> */}
    </>
  );
};

export default React.memo(Video);
