import Game from '../models/game';
import { ActiveGame, GameStatus } from '../types';

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

export default {
  saveFinishedGame,
};
