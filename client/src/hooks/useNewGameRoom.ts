import React from 'react';
import { Role, RTCGame, State } from '../types';
import logger from '../utils/logger';
import useAuthSocket from './useAuthSocket';
import useSelf from './useSelf';
import useTwilioRoom from './useTwilioRoom';
import { useHistory, useParams } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { setTimer } from '../reducers/kotitonni.local.reducer';
import { setGame as setGameInRedux } from '../reducers/rtcGameSlice';
import { Socket } from 'socket.io-client';

const socketOnLeaveCallback = (socket: Socket) => {
  socket.emit('leave-room');
};

const useNewGameRoom = (token: string | null, onCall: boolean, role: Role) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { username: hostName } = useParams<{ username: string }>();
  const game = useSelector((state: State) => state.rtc.game, shallowEqual);
  const [twilioToken, setTwilioToken] = React.useState<null | string>(null);
  const [socket, socketError] = useAuthSocket(token, socketOnLeaveCallback);
  const mySelf = useSelf(game, role === Role.HOST);
  const { participants, error: twilioError } = useTwilioRoom(
    twilioToken,
    onCall
  );

  if (socketError) console.error('socket error:', socketError);
  if (twilioError) logger.error('twilio error:', twilioError);

  // socketio listeners
  React.useEffect(() => {
    if (socket) {
      socket.emit('join-room');

      socket.on('game-updated', (updatedGame: RTCGame) => {
        logger.log('game-updated', updatedGame);

        const mappedPlayers = updatedGame.players.map((player) => ({
          ...player,
          hasTurn: player.id === updatedGame.info.turn,
        }));

        dispatch(setGameInRedux({ ...updatedGame, players: mappedPlayers }));
      });

      socket.on('rtc-error', (msg: string) => {
        logger.error('rtc error:', msg);
      });

      socket.on('game-ended', () => {
        logger.log(`recieved 'game-ended'`);

        history.push(`/${hostName}/kiitos`);
      });

      socket.on('timer-changed', (value: number) => {
        dispatch(setTimer(value));
      });
    }
  }, [socket, dispatch, history, hostName]);

  /* // set twilio token
  React.useEffect(() => {
    if (game && !twilioToken) {
      logger.log('checking for video token...');
      const videoToken =
        role === Role.HOST
          ? game.host.privateData.twilioToken
          : game.players.find((p) => !!p.privateData)?.privateData.twilioToken;

      if (videoToken) {
        logger.log('...token found');
        setTwilioToken(videoToken);
      } else {
        logger.log('...not found');
      }
    }
  }, [twilioToken, game, role]); */

  return {
    game,
    socket,
    mySelf,
    participants,
    setTwilioToken,
  };
};

export default useNewGameRoom;
