import React from 'react';

import { makeStyles, createStyles } from '@material-ui/core/styles';

import Loader from './Loader';
import RTCVideoFrame from './RTCVideoFrame';

import { RTCPeer } from '../types';
import { Participant } from 'twilio-video';

const useStyles = makeStyles(() =>
  createStyles({
    videoConf: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
  })
);

interface RTCVideoConferenceProps {
  participants: Map<string, Participant | null> | null;
}

const RTCVideoConference: React.FC<RTCVideoConferenceProps> = ({
  participants,
}) => {
  const classes = useStyles();

  /**
   * Calculates the order for the video windows, setting host as bottom -center if 6 players
   */
  const getOrder = (index: number, length: number) => {
    let order = index;

    if (index === length - 1) {
      order--;
    } else if (index === length - 2) {
      order++;
    }

    return order;
  };

  if (!participants) {
    return (
      <div className={classes.videoConf}>
        <Loader msg="Ladataan..." spinner />
      </div>
    );
  }

  console.log('partis', participants);

  return (
    <div className={classes.videoConf}>
      {/* {peers.map((peer, index) => (
        <RTCVideoFrame
          key={peer.id}
          peer={peer}
          order={getOrder(index, peers.length)}
        />
      ))} */}
    </div>
  );
};

export default RTCVideoConference;
