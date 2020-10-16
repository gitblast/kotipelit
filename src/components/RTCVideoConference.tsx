import React from 'react';

import { makeStyles, createStyles } from '@material-ui/core/styles';

import Loader from './Loader';
import RTCVideoFrame from './RTCVideoFrame';

import { GameStatus, RTCGame, RTCPeer } from '../types';

const useStyles = makeStyles(() =>
  createStyles({
    videoConf: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      width: '100%',
    },
  })
);

interface RTCVideoConferenceProps {
  peers: RTCPeer[] | null;
  isHost?: boolean;
}

const RTCVideoConference: React.FC<RTCVideoConferenceProps> = ({
  peers,
  isHost,
}) => {
  const classes = useStyles();

  /**
   * Calculates the order for the video windows, setting host as bottom -center if 6 players
   */
  const getOrder = React.useCallback((index, length) => {
    let order = index;

    if (index === length - 1) {
      order--;
    } else if (index === length - 2) {
      order++;
    }

    return order;
  }, []);

  if (!peers) {
    return (
      <div className={classes.videoConf}>
        <Loader msg="Ladataan..." spinner />
      </div>
    );
  }

  return (
    <div className={classes.videoConf}>
      {peers.map((peer, index) => (
        <RTCVideoFrame
          key={peer.id}
          peer={peer}
          order={getOrder(index, peers.length)}
          isHost={isHost}
        />
      ))}
    </div>
  );
};

export default RTCVideoConference;
