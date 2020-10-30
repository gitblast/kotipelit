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
  })
);

interface VideoProps {
  peer: RTCPeer;
}

const Video: React.FC<VideoProps> = ({ peer }) => {
  const classes = useStyles();
  const isMuted = useSelector(
    (state: State) => state.rtc.localData.mutedMap[peer.id]
  );

  console.log(`rendering video of ${peer.displayName}`);

  return (
    <video
      className={classes.absolute}
      ref={(videoRef) => {
        if (videoRef) {
          videoRef.srcObject = peer.stream;
        }
      }}
      autoPlay
      playsInline
      muted={peer.isMe || isMuted}
    />
  );
};

export default React.memo(Video);
