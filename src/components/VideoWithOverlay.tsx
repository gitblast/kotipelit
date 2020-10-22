import React from 'react';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import { RTCPeer, State } from '../types';
import { useSelector } from 'react-redux';

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
      backgroundColor: 'grey',
      position: 'relative',
    },
  })
);

interface VideoWithOverlayProps {
  peer: RTCPeer;
}

const VideoWithOverlay: React.FC<VideoWithOverlayProps> = ({
  peer,
  children,
}) => {
  const classes = useStyles();
  const mutedMap = useSelector((state: State) => state.rtc.localData.mutedMap);

  return (
    <div className={classes.frame}>
      <video
        className={classes.absolute}
        ref={(videoRef) => {
          if (videoRef) {
            videoRef.srcObject = peer.stream;
          }
        }}
        autoPlay
        playsInline
        muted={peer.isMe || mutedMap[peer.id]}
      />
      <div className={classes.absolute} id="overlayContainer">
        {children}
      </div>
    </div>
  );
};

export default VideoWithOverlay;
