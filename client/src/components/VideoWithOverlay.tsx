import React from 'react';

import Video from './Video';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { VideoTrack, AudioTrack } from 'twilio-video';

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
      backgroundColor: 'black',
      position: 'relative',
    },
  })
);

interface VideoWithOverlayProps {
  videoTrack: VideoTrack;
  audioTrack: AudioTrack;
  isMuted: boolean;
  children: React.ReactNode;
}

const VideoWithOverlay: React.FC<VideoWithOverlayProps> = ({
  videoTrack,
  audioTrack,
  isMuted,
  children,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.frame}>
      <div className={classes.absolute}>
        <Video
          videoTrack={videoTrack}
          audioTrack={audioTrack}
          isMuted={isMuted}
        />
      </div>
      <div className={classes.absolute} id="overlayContainer">
        {children}
      </div>
    </div>
  );
};

export default VideoWithOverlay;
