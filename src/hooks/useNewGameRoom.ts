import React from 'react';

import useAuthSocket from './useAuthSocket';
import useTwilioRoom from './useTwilioRoom';
import useInitialParticipants from './useInitialParticipants';

import { RTCGame } from '../types';
import logger from '../utils/logger';

const socketOnLeaveCallback = (socket: SocketIOClient.Socket) => {
  socket.emit('leave-room');
};

const getMyId = (game: RTCGame, isHost?: boolean) => {
  if (isHost) {
    return game.host.id;
  }

  const playerWithPrivateDataExposed = game.players.find(
    (p) => !!p.privateData
  );

  return playerWithPrivateDataExposed?.id ?? null;
};

interface MySelf {
  id: string;
  isHost: boolean;
  socket: SocketIOClient.Socket;
}

const useNewGameRoom = (
  token: string | null,
  onCall: boolean,
  isHost?: boolean
) => {
  const [game, setGame] = React.useState<null | RTCGame>(null);
  const [mySelf, setMySelf] = React.useState<null | MySelf>(null);
  const [twilioToken, setTwilioToken] = React.useState<null | string>(null);
  const [socket, socketError] = useAuthSocket(token, socketOnLeaveCallback);
  const initialParticipants = useInitialParticipants(game);
  const [participants, twilioError] = useTwilioRoom(
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

  // set self
  React.useEffect(() => {
    if (!mySelf && game && socket) {
      const myId = getMyId(game, isHost);

      if (!myId) {
        logger.error('self object not found!');
      } else {
        setMySelf({
          id: myId,
          isHost: !!isHost,
          socket,
        });
      }
    }
  }, [game, mySelf, isHost, socket]);

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
    mySelf,
    participants,
  };
};

export default useNewGameRoom;
