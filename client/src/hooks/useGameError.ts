import React from 'react';
import { ErrorState } from '../types';

const useGameError = () => {
  const [state, setState] = React.useState<ErrorState | null>(null);

  const setGameError = React.useCallback(
    (newError: Error | null, explanationMessage: string) => {
      setState(
        !newError
          ? null
          : { error: newError, explanationMsg: explanationMessage }
      );
    },
    []
  );

  const refreshGame = React.useCallback(() => {
    setState(null);

    window.location.reload();
  }, []);

  return {
    errorState: state,
    setError: setGameError,
    refreshGame,
  };
};

export default useGameError;
