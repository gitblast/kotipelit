import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import MicOffIcon from '@material-ui/icons/MicOff';
import MicIcon from '@material-ui/icons/Mic';
import { GameStatus, GameType, RTCPeer, State } from '../types';
import {
  Paper,
  Typography,
  IconButton,
  Checkbox,
  Fade,
  Button,
  Grid,
} from '@material-ui/core';

import logger from '../utils/logger';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { setClicked, setMuted } from '../reducers/kotitonni.local.reducer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    nameBadge: {
      padding: theme.spacing(2),
      backgroundColor: 'black',
      color: 'white',
      opacity: 0.8,
      width: '100%',
    },
    flexCol: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    flex: {
      display: 'flex',
    },
    spacer: {
      // fills empty space
      flex: '1 1 auto',
    },
    answerBubble: {
      position: 'absolute',
      width: 'fit-content',
      padding: theme.spacing(1),
      margin: theme.spacing(1),
      display: 'flex',
      alignItems: 'center',
    },
    // tooltipRoot: {
    //   position: 'absolute',
    //   height: 1,
    //   width: 1,
    //   top: '27.5%',
    //   left: '30%',
    // },
    // tooltipContent: {
    //   paddingLeft: theme.spacing(1),
    //   paddingRight: theme.spacing(1),
    //   backgroundColor: 'rgba(244, 172, 69)',
    // },
    // Repeating same code from HostOverlayItems
    controlIcon: {
      color: 'white',
    },
    positionLabel: {
      position: 'absolute',
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      margin: theme.spacing(1),
    },
  })
);

const DevBtns: React.FC = () => {
  const self = useSelector((state: State) => state.rtc.self, shallowEqual);

  return (
    <div>
      <Button onClick={() => self?.socket.disconnect()}>dc socket</Button>
      <Button onClick={() => self?.peer.destroy()}>dc peer</Button>
    </div>
  );
};

interface PlayerOverlayItemsProps {
  peer: RTCPeer;
}

const PlayerOverlayItems: React.FC<PlayerOverlayItemsProps> = ({ peer }) => {
  const playerId = peer.id;

  const classes = useStyles();
  const clickMap = useSelector(
    (state: State) => state.rtc.localData.clickedMap
  );
  const mutedMap = useSelector((state: State) => state.rtc.localData.mutedMap);
  const timer = useSelector((state: State) => state.rtc.localData.timer);
  const dispatch = useDispatch();
  const forHost = useSelector((state: State) => state.rtc.self?.isHost);
  const game = useSelector((state: State) => state.rtc.game);
  const player = useSelector(
    (state: State) => state.rtc.game?.players.find((p) => p.id === playerId),
    shallowEqual
  );
  const showPointAddition = React.useMemo(() => {
    if (timer === 0) {
      return true;
    }

    const values = Object.values(clickMap);

    return values.some((val) => !!val);
  }, [clickMap, timer]);

  const checked = !!clickMap[playerId];

  const handleChange = () => {
    dispatch(setClicked(playerId, !checked));
  };

  const getAnswer = () => {
    if (!game || !player || !player.answers) {
      return null;
    }

    const { turn, round } = game.info;

    const answers = player.answers[turn];

    if (!answers || !answers[round] || !answers[round].length) {
      return null;
    }

    return answers[round];
  };

  const answerBox = (answer: string) => {
    return (
      <Paper className={classes.answerBubble}>
        <Typography variant="subtitle2">{answer}</Typography>
        {forHost && answer && (
          <Checkbox checked={checked} onChange={handleChange} />
        )}
      </Paper>
      // <Tooltip
      //   title={
      //     <div className={classes.tooltipContent}>
      //       <Typography variant="h4" component="div">
      //         {answer}
      //       </Typography>
      //     </div>
      //   }
      //   open={true}
      //   arrow={true}
      //   placement="top"
      // >
      //   <div className={classes.tooltipRoot} />
      // </Tooltip>
    );
  };

  if (!game || !player) {
    return null;
  }

  const getPointAddition = (playerId: string, hasTurn: boolean): number => {
    const playerCount = game.players.length;
    const correctAnswers = game.players.reduce((sum, next) => {
      return clickMap[next.id] ? sum + 1 : sum;
    }, 0);

    switch (correctAnswers) {
      case playerCount - 1:
        return hasTurn ? -50 : 0;
      case 0:
        return hasTurn ? -50 : 0;
      case 1:
        return clickMap[playerId] || hasTurn ? 100 : 0;
      case 2:
        return clickMap[playerId] || hasTurn ? 30 : 0;
      case 3:
        return clickMap[playerId] || hasTurn ? 10 : 0;
    }

    return correctAnswers;
  };

  const getPosition = () => {
    const pos = game.players
      .map((player) => player.points)
      .sort((a, b) => b - a)
      .indexOf(player.points);

    return pos + 1;
  };

  const toggleMuted = () => {
    if (peer.isMe) {
      // toggle enable/disable audio track if self
      const audioTracks = peer.stream?.getAudioTracks();

      if (audioTracks && audioTracks.length) {
        audioTracks[0].enabled = !audioTracks[0].enabled;
      }
    }

    dispatch(setMuted(player.id, !mutedMap[playerId]));
  };

  const answer = getAnswer();

  const addition = getPointAddition(player.id, !!player.hasTurn);

  // handle different game types here
  if (game.type === GameType.KOTITONNI) {
    return (
      <div className={classes.flexCol}>
        {
          // eslint-disable-next-line no-undef
          process && process.env.NODE_ENV === 'development' && (
            <div style={{ position: 'absolute' }}>
              {forHost && (
                <Typography component="div">{`http://localhost:3000/username/rtc/${player.inviteCode}`}</Typography>
              )}
              {!peer.isMe && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography component="div">{`stream: ${!!peer.stream}`}</Typography>
                  <div style={{ width: 10 }} />
                  <Typography component="div">{`socket: ${!!peer.socketId}`}</Typography>
                </div>
              )}

              {peer.isMe && (
                <div>
                  <Typography color="error" variant="h4">
                    ME
                  </Typography>
                  <DevBtns />
                </div>
              )}
            </div>
          )
        }
        {forHost && answer && answerBox(answer)}
        {game.status === GameStatus.FINISHED && (
          <div className={classes.positionLabel}>
            <Typography variant="h3">{getPosition()}</Typography>
          </div>
        )}
        <div className={classes.flex}>
          <div className={classes.spacer} />
        </div>

        <div className={classes.spacer} />
        <div className={classes.flex}>
          <Grid container className={classes.nameBadge}>
            <Grid item sm={5}>
              <Typography variant="h6">{player.name}</Typography>
            </Grid>
            <Grid item sm={3}>
              <Typography variant="h6">{player.points}</Typography>
            </Grid>
            <Grid item sm={2}>
              {showPointAddition && addition !== 0 && (
                <Fade in>
                  <Typography>{addition}</Typography>
                </Fade>
              )}
            </Grid>
            <Grid item sm={2}>
              <IconButton
                size="small"
                onClick={toggleMuted}
                className={classes.controlIcon}
              >
                {mutedMap[player.id] ? (
                  <MicOffIcon color="error" />
                ) : (
                  <MicIcon />
                )}
              </IconButton>
            </Grid>
          </Grid>
          <div className={classes.spacer} />
        </div>
      </div>
    );
  }

  logger.error('unknown game type');

  return null;
};

export default PlayerOverlayItems;
