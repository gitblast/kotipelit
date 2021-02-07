/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Game from '../models/game';
import {
  ActiveGame,
  GameStatus,
  GameModel,
  GameType,
  GameInfo,
  RTCGame,
  InviteInfo,
} from '../types';

const getInviteMailData = (
  game: GameModel,
  playerId: string,
  displayName: string,
  hostName: string
): InviteInfo => {
  switch (game.type) {
    case GameType.KOTITONNI: {
      const player = game.players.find((player) => player.id === playerId);

      if (!player || !player.data.words) {
        throw new Error('Missing or invalid player when getting mail data');
      }

      return {
        url: `https://www.kotipelit.com/${hostName}/${player.inviteCode}`,
        cancelUrl: `https://www.kotipelit.com/${hostName}/peruuta/${player.inviteCode}`,
        gameType: GameType.KOTITONNI,
        displayName,
        startTime: game.startTime,
        data: {
          words: player.data.words,
        },
      };
    }
    default: {
      throw new Error('unknown game type');
    }
  }
};

const refreshGameReservations = async (gameId: string): Promise<GameModel> => {
  const game = await Game.findById(gameId);

  if (!game) {
    throw new Error(`Invalid request: no game found with id ${gameId}`);
  }

  if (game.status !== GameStatus.UPCOMING) {
    throw new Error(`Invalid request: game status is not upcoming`);
  }

  game.players = game.players.map((player) => {
    return player.reservedFor &&
      !player.reservedFor.locked &&
      player.reservedFor.expires < Date.now()
      ? {
          ...player,
          reservedFor: null,
        }
      : player;
  });

  return await game.save();
};

const getInitialInfo = (game: ActiveGame | GameModel): GameInfo => {
  /** handle different game types here */
  switch (game.type) {
    case GameType.KOTITONNI: {
      if (!game.players || !game.players.length)
        throw new Error('Game has no players set');

      const playerWithTurn = game.players[0];

      return {
        round: 1,
        turn: playerWithTurn.id,
        answeringOpen: false,
      };
    }
    default: {
      const gameType: string = game.type;
      throw new Error(`Invalid game type: ${gameType}`);
    }
  }
};

const getGameById = async (gameId: string): Promise<GameModel> => {
  const gameInDB = await Game.findById(gameId);

  if (!gameInDB) {
    throw new Error(`No game found with id ${gameId}`);
  }

  return gameInDB;
};

const saveFinishedGame = async (
  gameId: string,
  game: RTCGame | ActiveGame // active game only for jitsi version
): Promise<GameModel> => {
  const gameInDB = await Game.findById(gameId);

  if (!gameInDB) throw new Error(`No game found with id ${gameId}`);

  gameInDB.players = game.players;

  gameInDB.status = GameStatus.FINISHED;

  return await gameInDB.save();
};

const setGameStatus = async (
  gameId: string,
  newStatus: GameStatus
): Promise<GameModel> => {
  const game = await Game.findById(gameId);

  if (!game) throw new Error(`No game found with id ${gameId}`);

  game.status = newStatus;

  return await game.save();
};

const convertToRTCGame = (game: GameModel): RTCGame => {
  return {
    id: game._id.toString(),
    status: game.status,
    type: game.type,
    price: game.price,
    startTime: game.startTime,
    players: game.players,
    info: getInitialInfo(game),
    host: game.host.toString(),
    rounds: game.rounds,
  };
};

export default {
  saveFinishedGame,
  setGameStatus,
  getInitialInfo,
  getGameById,
  convertToRTCGame,
  refreshGameReservations,
  getInviteMailData,
};
