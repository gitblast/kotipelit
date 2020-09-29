import React from 'react';

import useGameRoom, {
  useHostGameToken,
  useMediaStream,
  usePlayerGameToken,
} from '../hooks/useGameRoom';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import { RTCPlayer } from '../types';
import { Card, CardContent, Fab, Typography } from '@material-ui/core';
import Loader from './Loader';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(2),
    },
    // conference
    videoConf: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-evenly',

      alignItems: 'center',
      minHeight: 400,
    },
    // video
    videoContainer: {
      width: `32%`,
      marginBottom: theme.spacing(1),
      textAlign: 'center',
    },
    video: {
      display: 'flex',
      backgroundColor: 'grey',
      width: '100%',
      minHeight: 200,
      alignItems: 'center',
      justifyContent: 'center',
    },
  })
);

interface VideoFrameProps {
  peer: RTCPlayer;
}

const VideoFrame: React.FC<VideoFrameProps> = ({ peer }) => {
  const classes = useStyles();

  return (
    <Card elevation={3} className={classes.videoContainer}>
      {peer.stream ? (
        <video
          className={classes.video}
          ref={(videoRef) => {
            if (videoRef) {
              videoRef.srcObject = peer.stream;
            }
          }}
        />
      ) : (
        <div className={classes.video}>
          <Typography>Ei videoyhteyttä</Typography>
        </div>
      )}
      <CardContent component="div">
        <Typography>
          {peer.isMe
            ? 'SINÄ'
            : peer.isHost
            ? `${peer.displayName} (HOST)`
            : peer.displayName}
        </Typography>
      </CardContent>
    </Card>
  );
};

interface VideoConferenceProps {
  peers: RTCPlayer[] | null;
  onCall: boolean;
  joinCall: () => void;
}

const VideoConference: React.FC<VideoConferenceProps> = ({
  peers,
  onCall,
  joinCall,
}) => {
  const classes = useStyles();

  if (!peers) {
    return (
      <div className={classes.videoConf}>
        <Loader msg="Ladataan..." spinner />
      </div>
    );
  }

  if (!onCall) {
    return (
      <div className={classes.videoConf}>
        <Fab variant="extended" onClick={joinCall}>
          Liity puheluun
        </Fab>
      </div>
    );
  }

  return (
    <div className={classes.videoConf}>
      {peers.map((peer) => (
        <VideoFrame key={peer.id} peer={peer} />
      ))}
    </div>
  );
};

const RTCGameRoom: React.FC<{ token: string | null }> = ({ token }) => {
  const classes = useStyles();

  const [usingMedia, setUsingMedia] = React.useState<boolean>(false);

  const [mediaStream, mediaStreamError] = useMediaStream(usingMedia);
  const [game, peers, myPeerId] = useGameRoom(token, mediaStream);

  if (mediaStreamError) {
    console.error('error', mediaStreamError);
  }

  React.useEffect(() => {
    if (peers) console.log('PEERS CHANGED:', peers);
  }, [peers]);

  const peersWithOwnStreamSet = (peerObjects: RTCPlayer[] | null) => {
    if (!peerObjects) {
      return null;
    }

    return peerObjects.map((peer) =>
      peer.peerId === myPeerId
        ? { ...peer, isMe: true, stream: mediaStream }
        : peer
    );
  };

  return (
    <div className={classes.container}>
      <VideoConference
        peers={peersWithOwnStreamSet(peers)}
        onCall={usingMedia}
        joinCall={() => setUsingMedia(true)}
      />
    </div>
  );
};

interface RTCVideoCallProps {
  isHost?: boolean;
}

const RTCVideoCall: React.FC<RTCVideoCallProps> = ({ isHost }) => {
  const { gameID } = useParams<{ gameID: string }>();
  const [token] = useHostGameToken(gameID);
  const playerToken = usePlayerGameToken();

  if (isHost) {
    return <RTCGameRoom token={token} />;
  }

  return <RTCGameRoom token={playerToken} />;
};

export default RTCVideoCall;
