import React from 'react';

import { Role, RTCGame, RTCSelf } from '../types';

import logger from '../utils/logger';
import { useGameErrorState } from '../context';

const getMyId = (game: RTCGame, role: Role) => {
  if (role === Role.HOST) {
    return game.host.id;
  }

  const playerWithPrivateDataExposed = game.players.find(
    (p) => !!p.privateData
  );

  return playerWithPrivateDataExposed?.id ?? null;
};

const useSelf = (game: RTCGame | null, role: Role) => {
  const [mySelf, setMySelf] = React.useState<null | RTCSelf>(null);

  const { setError } = useGameErrorState();

  React.useEffect(() => {
    if (!mySelf && game) {
      if (role === Role.SPECTATOR) {
        setMySelf({
          id: 'spectator',
          role,
        });
      } else {
        const myId = getMyId(game, role);

        if (!myId) {
          logger.error('self object not found!');

          setError(
            new Error('ID:tä vastaavaa pelaajaa ei löytynyt'),
            'Odottamaton virhe:'
          );
        } else {
          const self = {
            id: myId,
            role,
          };

          setMySelf(self);
        }
      }
    }
  }, [game, mySelf, role, setError]);

  return mySelf;
};

export default useSelf;
