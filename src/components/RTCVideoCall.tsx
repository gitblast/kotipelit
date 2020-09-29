import React from 'react';

import useGameRoom, {
  useHostGameToken,
  usePlayerGameToken,
} from '../hooks/useGameRoom';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(0),
    },
  })
);

const HostView: React.FC = () => {
  const classes = useStyles();
  const { gameID } = useParams<{ gameID: string }>();

  const [showVideo, setShowVideo] = React.useState<boolean>(false);

  const token = useHostGameToken(gameID);

  const [gameRoom, peers] = useGameRoom(token, showVideo);

  const handleClick = () => {
    setShowVideo(!showVideo);
  };

  return (
    <div className={classes.container}>
      <h4>Peers</h4>
      {peers &&
        peers.map((player) => {
          return (
            <div key={player.id}>
              <span>
                {player.displayName} {player.isHost && '(HOST)'}{' '}
              </span>
              <span>{player.peerId} </span>
              {player.stream && <span>STREAMING!</span>}
            </div>
          );
        })}
      <button onClick={handleClick}>
        {!showVideo ? 'show video' : 'hide video'}
      </button>
    </div>
  );
};

const PlayerView: React.FC = () => {
  const classes = useStyles();
  const [showVideo, setShowVideo] = React.useState<boolean>(false);

  const token = usePlayerGameToken();

  const [gameRoom, peers] = useGameRoom(token, showVideo);

  const handleClick = () => {
    setShowVideo(!showVideo);
  };

  return (
    <div className={classes.container}>
      <h4>Peers</h4>
      {peers &&
        peers.map((player) => {
          return (
            <div key={player.id}>
              <span>
                {player.displayName} {player.isHost && '(HOST)'}{' '}
              </span>
              <span>{player.peerId} </span>
              {player.stream && <span>STREAMING!</span>}
            </div>
          );
        })}
      <button onClick={handleClick}>
        {!showVideo ? 'show video' : 'hide video'}
      </button>
    </div>
  );
};

interface RTCVideoCallProps {
  isHost?: boolean;
}

const RTCVideoCall: React.FC<RTCVideoCallProps> = ({ isHost }) => {
  if (isHost) {
    return <HostView />;
  }

  return <PlayerView />;
};

export default RTCVideoCall;
