import React from 'react';

import useGameRoom, {
  useHostGameToken,
  useMediaStream,
  usePlayerGameToken,
} from '../hooks/useGameRoom';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import { RTCPlayer } from '../types';
import { Card, CardContent, Fab, Paper, Typography } from '@material-ui/core';
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
    videoWindow: {
      width: `32%`,
      marginBottom: theme.spacing(1),
      textAlign: 'center',
    },
    videoContainer: {
      backgroundColor: 'grey',
      width: '100%',
    },
    video: {
      width: '100%',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    placeHolder: {
      paddingTop: '75%',
      backgroundColor: 'grey',
      position: 'relative',
    },
    placeHolderText: {
      position: 'absolute',
      top: '50%',
      bottom: 0,
      left: 0,
      right: 0,
    },
    hoverContainer: {
      width: '20%',
      position: 'absolute',
      top: '5%',
      bottom: 0,
      left: '75%',
      right: 0,
    },
    points: {
      backgroundColor: 'grey',
      color: 'white',
      opacity: 0.95,
    },
    hostBadge: {
      backgroundColor: 'red',
      color: 'white',
      opacity: 0.95,
    },
  })
);

interface VideoFrameProps {
  peer: RTCPlayer;
}

const VideoFrame: React.FC<VideoFrameProps> = ({ peer }) => {
  const classes = useStyles();

  return (
    <Card elevation={3} className={classes.videoWindow} id="vid">
      {peer.stream ? (
        <div className={classes.placeHolder}>
          <video
            className={classes.video}
            ref={(videoRef) => {
              if (videoRef) {
                videoRef.srcObject = peer.stream;
              }
            }}
            autoPlay
            playsInline
            muted={peer.isMe}
          />
          <div className={classes.hoverContainer}>
            {peer.isHost ? (
              <Paper className={classes.hostBadge}>
                <Typography>HOST</Typography>
              </Paper>
            ) : (
              <Paper className={classes.points}>
                <Typography>{`Pisteet: 0`}</Typography>
              </Paper>
            )}
          </div>
        </div>
      ) : (
        <div className={classes.placeHolder}>
          <div className={classes.placeHolderText}>
            <Typography>Ei videoyhteyttä</Typography>
          </div>
        </div>
      )}
      <CardContent component="div">
        <Typography>{peer.isMe ? 'SINÄ' : peer.displayName}</Typography>
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
    if (peers) {
      console.log('PEERS CHANGED:', peers);
    }
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
