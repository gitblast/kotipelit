import React from 'react';
import { RTCGame, GameToAdd } from '../types';
import { AllGamesProvider, useUser } from '../context';
import gameService from '../services/games';
import logger from '../utils/logger';
import axios, { AxiosError } from 'axios';

interface GamesProviderProps {
  children: React.ReactNode;
}
const GamesProvider = ({ children }: GamesProviderProps) => {
  const [games, setGames] = React.useState<RTCGame[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null | AxiosError>(null);
  const { logout } = useUser();

  React.useEffect(() => {
    // if error type is unauthorized, logout user
    if (error && axios.isAxiosError(error) && error.response?.status === 401) {
      logout();
    }
  }, [error, logout]);

  const initGames = React.useCallback(async () => {
    setLoading(true);
    try {
      const allGames = await gameService.getAll();

      setGames(allGames);
    } catch (error) {
      logger.error(
        `error initializing games: ${error.message} ${error.response?.data}`
      );

      // should show some app-wide error message here
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteGame = React.useCallback(async (id: string) => {
    setLoading(true);

    try {
      await gameService.deleteGame(id);

      setGames((previousGames) => {
        return previousGames.filter((game) => game.id !== id);
      });
    } catch (error) {
      logger.error(
        `error deleting game: ${error.message} ${error.response?.data}`
      );

      // should show some app-wide error message here
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addGame = React.useCallback(async (gameToAdd: GameToAdd) => {
    setLoading(true);

    logger.log(`adding new game`, gameToAdd);

    try {
      const added = await gameService.addNew(gameToAdd);

      return added;
    } catch (e) {
      logger.error(`error adding game: ${e.message}`);

      // should show some app-wide error message here
      setError(e.message);

      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  const data = React.useMemo(
    () => ({
      games,
      setGames,
      loading,
      setLoading,
      initGames,
      deleteGame,
      error,
      clearError,
      addGame,
    }),
    [games, loading, initGames, deleteGame, error, clearError, addGame]
  );

  return <AllGamesProvider value={data}>{children}</AllGamesProvider>;
};

export default GamesProvider;
