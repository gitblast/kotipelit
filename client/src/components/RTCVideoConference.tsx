import React from 'react';

import { makeStyles, createStyles } from '@material-ui/core/styles';

// import Loader from './Loader';
import RTCVideoFrame from './RTCVideoFrame';

import { RTCParticipant } from '../types';
// import { useGameErrorState } from '../context';

import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles(() =>
  createStyles({
    videoConf: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    skeletonStyles: {
      width: '90%',
      margin: 'auto',
    },
    skeletonBox: {
      height: '55vh',
      backgroundColor: 'rgb(147 165 164 / 11%)',
    },
    skeletonText: {
      height: '7vh',
      backgroundColor: 'rgb(147 165 164 / 11%)',
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

  // const { errorState } = useGameErrorState();

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
      <>
        <div className={classes.skeletonStyles}>
          <Skeleton variant="rect" className={classes.skeletonBox} />
          <Skeleton variant="text" className={classes.skeletonText} />
          {/* Check the browser here latest? + Add message for waiting for host */}
        </div>
        {/* <div className={classes.videoConf}>
          <Loader msg="Ladataan.." spinner errored={!!errorState} />
        </div> */}
      </>
    );
  }

  return (
    <div className={classes.videoConf}>
      {participants.map((participant, index) => (
        <RTCVideoFrame
          key={participant.id}
          participant={participant}
          order={getOrder(index, participants.length)}
        />
      ))}
    </div>
  );
};

export default RTCVideoConference;
