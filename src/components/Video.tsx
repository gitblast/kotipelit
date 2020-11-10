import React from 'react';

import { makeStyles, createStyles } from '@material-ui/core/styles';

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
  stream: MediaStream;
  isMuted: boolean;
}

const Video: React.FC<VideoProps> = ({ stream, isMuted }) => {
  const classes = useStyles();

  const vidRef = React.useRef<HTMLVideoElement | null>(null);

  React.useEffect(() => {
    if (vidRef.current) {
      vidRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      className={classes.absolute}
      ref={vidRef}
      autoPlay
      playsInline
      muted={isMuted}
    />
  );
};

export default React.memo(Video);
