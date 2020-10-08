import React from 'react';

import useGameRoom from '../hooks/useGameRoom';
import useMediaStream from '../hooks/useMediaStream';
import usePlayerGameToken from '../hooks/usePlayerGameToken';
import useHostGameToken from '../hooks/useHostGameToken';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
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

const GameRoom: React.FC<{ token: string | null }> = ({ token }) => {
  const classes = useStyles();

  const [usingMedia, setUsingMedia] = React.useState<boolean>(false);

  const MEDIA_CONSTRAINTS = { audio: true, video: false };

  if (!MEDIA_CONSTRAINTS.video) {
    console.warn('NOT REQUESTING VIDEO (needs to be changed in code)');
  }

  const [mediaStream, mediaStreamError] = useMediaStream(
    usingMedia,
    MEDIA_CONSTRAINTS
  );
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

const RTCGameForPlayer: React.FC = () => {
  const [token, error] = usePlayerGameToken();

  if (error) {
    console.warn('handle errors');
  }

  return <GameRoom token={token} />;
};

const RTCGameForHost: React.FC = () => {
  const [token, error] = useHostGameToken();

  if (error) {
    console.warn('handle errors');
  }

  return <GameRoom token={token} />;
};

interface RTCGameRoomProps {
  isHost?: boolean;
}

// redirects to correct component
const RTCGameRoom: React.FC<RTCGameRoomProps> = ({ isHost }) => {
  return isHost ? <RTCGameForHost /> : <RTCGameForPlayer />;
};

export default RTCGameRoom;
