import React from 'react';

import Video from './Video';
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
    frame: {
      width: '100%',
      paddingTop: '75%',
      backgroundColor: 'darkgrey',
      position: 'relative',
    },
  })
);

interface VideoWithOverlayProps {
  stream: MediaStream;
  isMuted: boolean;
  children: React.ReactNode;
}

const VideoWithOverlay: React.FC<VideoWithOverlayProps> = ({
  stream,
  isMuted,
  children,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.frame}>
      <Video stream={stream} isMuted={isMuted} />
      <div className={classes.absolute} id="overlayContainer">
        {children}
      </div>
    </div>
  );
};

export default VideoWithOverlay;
