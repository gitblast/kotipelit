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

  return {
    errorState: state,
    setError: setGameError,
  };
};

export default useGameError;
