import React from 'react';
import { RTCGame } from '../types';
import logger from '../utils/logger';
import useAuthSocket from './useAuthSocket';
import useInitialParticipants from './useInitialParticipants';
import useSelf from './useSelf';
import useTwilioRoom from './useTwilioRoom';

const socketOnLeaveCallback = (socket: SocketIOClient.Socket) => {
  socket.emit('leave-room');
};

const useNewGameRoom = (
  token: string | null,
  onCall: boolean,
  isHost?: boolean
) => {
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

        setGame(updatedGame);
      });

      socket.on('rtc-error', (msg: string) => {
        logger.error('rtc error:', msg);
      });
    }
  }, [socket]);

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
