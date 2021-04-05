import Game from '../models/game';
import { GameModel, GameStatus, NewGame, RTCGame } from '../types';
import shortid from 'shortid';
import { getInitialInfo } from '../utils/helpers';
import { shuffle } from 'lodash';

const getAllGamesByUser = async (userId: string) => {
  return await Game.find({ 'host.id': userId });
};

const getGameById = async (gameId: string): Promise<GameModel> => {
  const gameInDB = await Game.findById(gameId);

  if (!gameInDB) {
    throw new Error(`Invalid request: No game found with id ${gameId}`);
  }

  return gameInDB;
};

const getGameAsObject = (game: GameModel): RTCGame => {
  return {
    ...game.toObject(),
    id: game._id.toString(),
  };
};

const addGame = async (newGame: NewGame) => {
  const gameWithoutInfo = {
    ...newGame,
    createDate: new Date(),
    players: newGame.players.map((player) => {
      return {
        ...player,
        id: shortid.generate(),
        reservedFor: null,
        privateData: {
          ...player.privateData,
          inviteCode: shortid.generate(),
        },
      };
    }),
  };

  const game = new Game({
    ...gameWithoutInfo,
    info: getInitialInfo(gameWithoutInfo),
  });

  return await game.save();
};

const saveFinishedGame = async (
  gameId: string,
  game: RTCGame
): Promise<GameModel> => {
  const gameInDB = await getGameById(gameId);

  gameInDB.players = game.players;

  gameInDB.status = GameStatus.FINISHED;

  return await gameInDB.save();
};

const setGameStatus = async (
  gameId: string,
  newStatus: GameStatus
): Promise<GameModel> => {
  const game = await getGameById(gameId);

  game.status = newStatus;

  return await game.save();
};

const shufflePlayers = async (gameId: string) => {
  const game = await getGameById(gameId);

  game.players = shuffle(game.players);

  await game.save();
};

export default {
  saveFinishedGame,
  setGameStatus,
  getGameById,
  getAllGamesByUser,
  addGame,
  shufflePlayers,
  getGameAsObject,
};
