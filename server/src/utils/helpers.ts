import { io as ioServer } from '../index';
import {
  FilteredRTCGame,
  GameInfo,
  GameModel,
  GameType,
  InviteInfo,
  NewGame,
  RTCGame,
  RTCGameState,
} from '../types';
import UpdateEmittingTimer from './timer';

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
        spectatorUrl:
          game.allowedSpectators !== 0
            ? `https://www.kotipelit.com/${hostName}/live/${game._id.toString()}`
            : null,
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
  const filtered = {
    ...game,
    players: game.players.map((player) => {
      return {
        ...player,
        reservedFor: null,
        privateData: null,
      };
    }),
  };

  return filtered;
};

export const filterGameForUser = (
  game: RTCGame,
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

export const getInitialGameState = (game: GameModel): RTCGameState => {
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
