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
} from '../types';

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

  if (!gameInDB) throw new Error(`No game found with id ${gameId}`);

  return gameInDB;
};

const saveFinishedGame = async (
  gameId: string,
  game: ActiveGame
): Promise<void> => {
  const gameInDB = await Game.findById(gameId);

  if (!gameInDB) throw new Error(`No game found with id ${gameId}`);

  gameInDB.players = game.players;

  gameInDB.status = GameStatus.FINISHED;

  await gameInDB.save();
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
    status: GameStatus.WAITING,
    type: game.type,
    price: game.price,
    startTime: game.startTime,
    players: game.players,
    info: getInitialInfo(game),
    host: game.host.toString(),
  };
};

export default {
  saveFinishedGame,
  setGameStatus,
  getInitialInfo,
  getGameById,
  convertToRTCGame,
};
