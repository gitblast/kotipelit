import React from 'react';
import { Socket } from 'socket.io-client';
import { InGameTimerData, MediaMutedStates } from '../types';

const createCtx = <A extends unknown | null>() => {
  const ctx = React.createContext<A | undefined>(undefined);

  const useCtx = () => {
    const c = React.useContext(ctx);
    if (c === undefined)
      throw new Error('useCtx must be inside a Provider with a value');
    return c;
  };
  return [useCtx, ctx.Provider] as const; // 'as const' makes TypeScript infer a tuple
};

export const [useInGameSocket, InGameSocketProvider] = createCtx<Socket>();

export const [useInGameTimer, InGameTimerProvider] = createCtx<
  InGameTimerData
>();

export const [useMediaMutedStates, MediaMutedStatesProvider] = createCtx<
  MediaMutedStates
>();
