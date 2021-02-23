import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import MicOffIcon from '@material-ui/icons/MicOff';
import MicIcon from '@material-ui/icons/Mic';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';

import { GameStatus, GameType, RTCParticipant, State } from '../types';
import {
  Paper,
  Typography,
  IconButton,
  Checkbox,
  Grid,
} from '@material-ui/core';

import { Animated } from 'react-animated-css';

import logger from '../utils/logger';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { setClicked, setMuted } from '../reducers/kotitonni.local.reducer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    nameBadge: {
      padding: theme.spacing(1),
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      width: '100%',
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(0.5),
      },
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
      // Shapes made with https://bennettfeely.com/clippy/
      clipPath:
        'polygon(0% 0%, 100% 0%, 100% 75%, 79% 75%, 80% 99%, 55% 76%, 0% 75%)',
      position: 'absolute',
      width: 'fit-content',
      padding: theme.spacing(1),
      paddingBottom: theme.spacing(3),
      margin: theme.spacing(1),
      display: 'flex',
      alignItems: 'center',
    },
    pointsAddition: {
      color: 'white',
      display: 'flex',
      justifyContent: 'flex-end',
      fontSize: theme.spacing(6),
      position: 'absolute',
      top: '36%',
    },
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
    playerName: {
      [theme.breakpoints.down('sm')]: {
        fontSize: 18,
      },
    },
  })
);

interface PlayerOverlayItemsProps {
  participant: RTCParticipant;
}

const PlayerOverlayItems: React.FC<PlayerOverlayItemsProps> = ({
  participant,
}) => {
  const playerId = participant.id;
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
    if (!game || !player || !player.privateData?.answers) {
      return null;
    }

    const { turn, round } = game.info;

    const answers = player.privateData.answers[turn];

    if (!answers || !answers[round] || !answers[round].length) {
      return null;
    }

    return answers[round];
  };

  const answerBox = (answer: string) => {
    return (
      <Paper className={classes.answerBubble}>
        <Typography variant="h6">{answer}</Typography>
        {forHost && answer && (
          <Checkbox checked={checked} onChange={handleChange} />
        )}
      </Paper>
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

  // const getPosition = () => {
  //   const pos = game.players
  //     .map((player) => player.points)
  //     .sort((a, b) => b - a)
  //     .indexOf(player.points);

  //   return pos + 1;
  // };

  const toggleMuted = () => {
    /* if (participant.isMe) {
      // toggle enable/disable audio track if self
      const audioTracks = peer.stream?.getAudioTracks();

      if (audioTracks && audioTracks.length) {
        audioTracks[0].enabled = !audioTracks[0].enabled;
      }
    }

    dispatch(setMuted(player.id, !mutedMap[playerId])); */

    console.log('TODO: HANDLE MUTE');
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
                <Typography component="div">{`http://localhost:3000/username/${player.privateData.inviteCode}`}</Typography>
              )}

              {participant.isMe && (
                <div>
                  <Typography color="error" variant="h4">
                    ME
                  </Typography>
                </div>
              )}
            </div>
          )
        }
        {forHost && showPointAddition && addition !== 0 && (
          <div>
            <Animated
              animationIn="fadeIn"
              animationInDuration={2000}
              animationOut="fadeOut"
              isVisible={true}
            >
              <Typography variant="h6" className={classes.pointsAddition}>
                {addition}
              </Typography>
            </Animated>
          </div>
        )}
        {forHost && answer && answerBox(answer)}
        {game.status === GameStatus.FINISHED && (
          <div className={classes.positionLabel}>
            {/* Final position expressed later with animations */}
            {/* <Typography variant="h3">{getPosition()}</Typography> */}
          </div>
        )}

        <div className={classes.flex}>
          <div className={classes.spacer} />
        </div>

        <div className={classes.spacer} />
        <div className={classes.flex}>
          <Grid container className={classes.nameBadge}>
            <Grid item md={7} sm={6}>
              <Typography variant="h6" className={classes.playerName}>
                {player.name}
              </Typography>
            </Grid>
            <Grid item md={2} sm={2}>
              <Typography variant="h6">{player.points}</Typography>
            </Grid>

            <Grid item md={3} sm={4}>
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
              <IconButton size="small" className={classes.controlIcon}>
                {/* <VideocamOffIcon></VideocamOffIcon> */}
                <VideocamIcon></VideocamIcon>
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
