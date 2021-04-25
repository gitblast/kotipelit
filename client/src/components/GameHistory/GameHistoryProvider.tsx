import React from 'react';
import { RTCGame } from '../../types';
import { InGameHistoryProvider } from '../../context';

const GameHistoryProvider: React.FC = ({ children }) => {
  const [history, setHistory] = React.useState<null | RTCGame>(null);
  const [atHistory, setAtHistory] = React.useState(false);

  const data = React.useMemo(
    () => ({
      history,
      setHistory,
      atHistory,
      setAtHistory,
    }),
    [history, atHistory]
  );

  return <InGameHistoryProvider value={data}>{children}</InGameHistoryProvider>;
};

export default GameHistoryProvider;
