import React from 'react';

import { makeStyles, createStyles } from '@material-ui/core/styles';

import Loader from './Loader';
import MediaStatesProvider from './MediaStatesProvider/MediaStatesProvider';
import RTCVideoFrame from './RTCVideoFrame';

import { RTCParticipant } from '../types';

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
  participants: RTCParticipant[] | null;
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
      // Check the browser here latest? + Add message for waiting for host
      <div className={classes.videoConf}>
        <Loader msg="Ladataan.." spinner />
      </div>
    );
  }

  return (
    <MediaStatesProvider>
      <div className={classes.videoConf}>
        {participants.map((participant, index) => (
          <RTCVideoFrame
            key={participant.id}
            participant={participant}
            order={getOrder(index, participants.length)}
          />
        ))}
      </div>
    </MediaStatesProvider>
  );
};

export default RTCVideoConference;
