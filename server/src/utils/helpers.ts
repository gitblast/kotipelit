import {
  GameModel,
  RTCGame,
  NewGame,
  GameInfo,
  GameType,
  InviteInfo,
  FilteredRTCGame,
  RTCGameState,
} from '../types';

import { io as ioServer } from '../index';
import UpdateEmittingTimer from './timer';

export const convertToRTCGame = (game: GameModel): RTCGame => {
  return {
    id: game._id.toString(),
    status: game.status,
    type: game.type,
    price: game.price,
    startTime: game.startTime,
    players: game.players,
    allowedSpectators: game.allowedSpectators,
    info: getInitialInfo(game),
    host: {
      id: game.host.id.toString(),
      displayName: game.host.displayName,
      privateData: null,
    },
    rounds: game.rounds,
  };
};

export const getInitialInfo = (game: NewGame): GameInfo => {
  /** handle different game types here */
  switch (game.type) {
    case GameType.KOTITONNI: {
      if (!game.players || !game.players.length)
        throw new Error('Game has no players set');

      const playerWithTurn = game.players[0];

      return {
        round: 1,
        turn: playerWithTurn.id,
      };
    }
    default: {
      const gameType: string = game.type;
      throw new Error(`Invalid game type: ${gameType}`);
    }
  }
};

export const getInviteMailData = (
  game: GameModel,
  playerId: string,
  displayName: string,
  hostName: string
): InviteInfo => {
  switch (game.type) {
    case GameType.KOTITONNI: {
      const player = game.players.find((player) => player.id === playerId);

      if (!player || !player.privateData.words) {
        throw new Error('Missing or invalid player when getting mail data');
      }

      return {
        url: `https://www.kotipelit.com/${hostName}/${player.privateData.inviteCode}`,
        cancelUrl: `https://www.kotipelit.com/${hostName}/peruuta/${player.privateData.inviteCode}`,
        gameType: GameType.KOTITONNI,
        displayName: displayName.trim(),
        startTime: game.startTime,
        data: {
          words: player.privateData.words,
        },
      };
    }
    default: {
      throw new Error('unknown game type');
    }
  }
};

export const filterGameForSpectator = (game: RTCGame): FilteredRTCGame => {
  return {
    ...game,
    players: game.players.map((player) => {
      return {
        ...player,
        reservedFor: null,
        privateData: null,
      };
    }),
  };
};

export const filterGameForUser = (
  game: RTCGame | GameModel,
  userId: string
): FilteredRTCGame | RTCGame => {
  if (userId === game.host.id.toString()) {
    // return all data to host

    return game as RTCGame;
  }

  if (game.type === GameType.KOTITONNI) {
    // hide private data
    return {
      ...game,
      players: game.players.map((player) => {
        return player.id === userId
          ? player
          : {
              ...player,
              reservedFor: null,
              privateData: null,
            };
      }),
    };
  }

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  throw new Error(`invalid game type: ${game.type}`);
};

export const getInitialGameState = (game: RTCGame): RTCGameState => {
  switch (game.type) {
    case GameType.KOTITONNI:
      const tickInterval = process.env.NODE_ENV === 'development' ? 50 : 1000;
      const initialValue = 60;

      return {
        timer: new UpdateEmittingTimer(
          ioServer,
          game.id,
          initialValue,
          tickInterval
        ),
      };
    default:
      throw new Error(
        `cannot get initial game state: unknown game type '${game.type}'`
      );
  }
};