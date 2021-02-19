import React from 'react';
import { RTCGame } from '../types';
import logger from '../utils/logger';
import useAuthSocket from './useAuthSocket';
import useInitialParticipants from './useInitialParticipants';
import useSelf from './useSelf';
import useTwilioRoom from './useTwilioRoom';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setTimer } from '../reducers/kotitonni.local.reducer';
import { setGame as setGameInRedux } from '../reducers/rtcGameSlice';

const socketOnLeaveCallback = (socket: SocketIOClient.Socket) => {
  socket.emit('leave-room');
};

const useNewGameRoom = (
  token: string | null,
  onCall: boolean,
  isHost?: boolean
) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { username: hostName } = useParams<{ username: string }>();
  const [game, setGame] = React.useState<null | RTCGame>(null);
  const [twilioToken, setTwilioToken] = React.useState<null | string>(null);
  const [socket, socketError] = useAuthSocket(token, socketOnLeaveCallback);
  const mySelf = useSelf(game, isHost);
  const initialParticipants = useInitialParticipants(game, mySelf?.id ?? null);
  const { participants, error: twilioError } = useTwilioRoom(
    twilioToken,
    onCall,
    initialParticipants
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
        setGame({ ...updatedGame, players: mappedPlayers });
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

  // set twilio token
  React.useEffect(() => {
    if (game && !twilioToken) {
      logger.log('checking for video token...');
      const videoToken = isHost
        ? game.host.privateData.twilioToken
        : game.players.find((p) => !!p.privateData)?.privateData.twilioToken;

      if (videoToken) {
        logger.log('...token found');
        setTwilioToken(videoToken);
      } else {
        logger.log('...not found');
      }
    }
  }, [twilioToken, game, isHost]);

  return {
    game,
    socket,
    mySelf,
    participants,
  };
};

export default useNewGameRoom;
