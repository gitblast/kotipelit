import React from 'react';

export const InGameSocket = React.createContext<SocketIOClient.Socket | null>(
  null
);
