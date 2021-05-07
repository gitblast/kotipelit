import {
  FilteredRTCGame,
  GameInfo,
  GameModel,
  GameType,
  InviteInfo,
  NewGame,
  RTCGame,
  RTCGameState,
  GameStatus,
} from '../types';
import DBUpdatingTimer from './timer';

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
        timer: {
          value: 60,
          isRunning: false,
        },
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

export const getGameAsObject = (game: GameModel): RTCGame => {
  return {
    ...game.toObject(),
    id: game._id.toString(),
  };
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
        timer: new DBUpdatingTimer(
          game._id.toString(),
          initialValue,
          false,
          tickInterval
        ),
      };
    default:
      throw new Error(
        `cannot get initial game state: unknown game type '${game.type}'`
      );
  }
};

/** Kotitonni */

export const getPointAddition = (
  game: GameModel,
  clickMap: Record<string, boolean>,
  playerId: string,
  hasTurn: boolean
): number => {
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

export const getNextRoundAndTurn = (game: GameModel) => {
  const playerInTurn = game.players.find(
    (player) => player.id === game.info.turn
  );

  if (!playerInTurn) {
    throw new Error('no player with turn set when trying to update');
  }

  const playerInTurnIndex = game.players.indexOf(playerInTurn);

  let round: number;
  let turn: string;

  if (playerInTurnIndex === game.players.length - 1) {
    round = game.info.round + 1;
    turn = game.players[0].id;
  } else {
    round = game.info.round;
    turn = game.players[playerInTurnIndex + 1].id;
  }

  return { round, turn };
};

export const saveNextKotitonniState = async (
  game: GameModel,
  pointsMap: Record<string, number>,
  fromHistory: boolean
) => {
  const newPlayers = game.players.map((player) => {
    return {
      ...player,
      points: pointsMap[player.id] ?? player.points,
    };
  });

  // update players

  game.players = newPlayers;

  let { round, turn } = game.info;

  if (!fromHistory) {
    /** update only player points if request came from history state */

    const updated = getNextRoundAndTurn(game);

    round = updated.round;
    turn = updated.turn;
  }

  // update info

  game.info = {
    ...game.info,
    timer: {
      value: 60,
      isRunning: false,
    },
    round,
    turn,
  };

  // update status

  game.status = round > 3 ? GameStatus.FINISHED : game.status;

  return await game.save();
};
