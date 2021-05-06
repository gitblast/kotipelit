import React from 'react';
import { Role, RTCGame } from '../types';
import logger from '../utils/logger';
import useAuthSocket from './useAuthSocket';
import useSelf from './useSelf';
import useTwilioRoom from './useTwilioRoom';
import { useHistory, useParams } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { useGameErrorState, useMediaMutedStates } from '../context';

const socketOnLeaveCallback = (socket: Socket) => {
  socket.emit('leave-room');
};

const useNewGameRoom = (token: string | null, role: Role) => {
  const { setMuted } = useMediaMutedStates();
  const { setError } = useGameErrorState();
  const [gameEnded, setGameEnded] = React.useState(false);
  const [onCall, setOnCall] = React.useState<boolean>(false);
  const history = useHistory();
  const { username: hostName } = useParams<{ username: string }>();
  const [game, setGame] = React.useState<RTCGame | null>(null);
  const [twilioToken, setTwilioToken] = React.useState<null | string>(null);
  const socket = useAuthSocket(token, socketOnLeaveCallback);
  const mySelf = useSelf(game, role);
  const { room, participants, spectatorCount } = useTwilioRoom(
    game,
    mySelf?.id ?? null,
    twilioToken,
    onCall,
    role === Role.SPECTATOR
  );

  // socketio listeners
  React.useEffect(() => {
    if (socket) {
      logger.log('attaching socket io listeners');

      /** TEST */
      socket.on('testing', (data: string) => {
        console.log('got message:', data);
      });

      socket.on('game-updated', (updatedGame: RTCGame) => {
        logger.log('game-updated', updatedGame);

        const mappedPlayers = updatedGame.players.map((player) => ({
          ...player,
          hasTurn: player.id === updatedGame.info.turn,
        }));

        setGame({ ...updatedGame, players: mappedPlayers });
      });

      socket.on('twilio-token', (token: string) => {
        setTwilioToken(token);
      });

      socket.on('rtc-error', (msg: string) => {
        logger.error('rtc error:', msg);

        setError(new Error(msg), 'Ongelma peliyhteydessä');
      });

      socket.on('game-ended', () => {
        setGameEnded(true);
      });

      socket.on('set-audio-muted', (id: string, muted: boolean) => {
        logger.log(`audio ${muted ? 'muted' : 'unmuted'} remotely`);

        setMuted(id, muted);
      });

      // set listeners before connecting

      logger.log('connecting socket');

      socket.connect();
    }
  }, [socket, setError, setMuted]);

  React.useEffect(() => {
    if (socket) {
      const handler = () => {
        logger.error('duplicate connection');

        setError(
          new Error('Päällekkäiset yhteydet'),
          'Yhteytesi on katkaistu, sillä olet liittynyt peliin muualla. Jos haluat jatkaa pelaamista tällä laitteella, lataa sivu uudelleen.'
        );

        logger.log('disconnecting socket');
        socket.disconnect();

        if (room) {
          logger.log('disconnecting room');
          room?.disconnect();
        }
      };

      socket.on('duplicate', handler);

      return () => {
        socket.off('duplicate', handler);
      };
    }
  }, [socket, room, setError]);

  React.useEffect(() => {
    if (gameEnded) {
      logger.log('redirecting to thank you page');

      history.push({ pathname: `/${hostName}/kiitos`, state: { game, role } });
    }
  }, [gameEnded, history, hostName, game, role]);

  const handleJoinCall = React.useCallback(
    (dev?: boolean) => {
      if (socket) {
        const callback = dev
          ? () => {
              logger.log('using mock token');

              setTwilioToken('DEVELOPMENT');
            }
          : (token: string) => {
              logger.log('got twilio token');

              setTwilioToken(token);
            };

        if (role === Role.HOST) {
          socket.emit('launch', callback);
        } else {
          socket.emit('get-twilio-token', callback);
        }

        setOnCall(true);
      } else {
        logger.error('socket was null trying to emit launch');
      }
    },
    [socket, role]
  );

  const updateGame = React.useCallback((updatedGame: RTCGame) => {
    setGame(updatedGame);
  }, []);

  return {
    game,
    updateGame,
    socket,
    mySelf,
    participants,
    onCall,
    spectatorCount,
    handleJoinCall,
  };
};

export default useNewGameRoom;
