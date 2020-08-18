import Game from '../models/game';
import {
  ActiveGame,
  GameStatus,
  GameModel,
  GameType,
  GameInfo,
} from '../types';

const getInitialInfo = (game: ActiveGame): GameInfo => {
  /** handle different game types here */
  switch (game.type) {
    case GameType.SANAKIERTO: {
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

export default {
  saveFinishedGame,
  setGameStatus,
  getInitialInfo,
};
