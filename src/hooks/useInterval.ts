import React from 'react';

const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = React.useRef<() => void>();

  // Remember the latest callback
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  React.useEffect(() => {
    const tick = () => {
      if (!savedCallback || !savedCallback.current)
        throw new Error('Problem with interval hook');
      savedCallback.current();
    };
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

export default useInterval;
