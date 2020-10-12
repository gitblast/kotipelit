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
  game: RTCGame | null;
  isHost?: boolean;
}

const RTCVideoConference: React.FC<RTCVideoConferenceProps> = ({
  peers,
  game,
  isHost,
}) => {
  const classes = useStyles();

  const findPlayerById = React.useCallback(
    (id: string) => game?.players.find((p) => p.id === id),
    [game]
  );

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

  if (!peers || !game) {
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
          player={findPlayerById(peer.id)}
          order={getOrder(index, peers.length)}
          game={game}
          highlightTurn={game.status === GameStatus.RUNNING}
          isHost={isHost}
        />
      ))}
    </div>
  );
};

export default RTCVideoConference;
