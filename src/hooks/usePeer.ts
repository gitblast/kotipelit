import Peer from 'peerjs';
import React from 'react';
import xirsysService from '../services/xirsys';
import { IceServers } from '../types';

import logger from '../utils/logger';

const usePeer = (
  token: string | null,
  onLeave?: (client: Peer) => void
): [Peer | null, string | null] => {
  const [peerClient, setPeerClient] = React.useState<Peer | null>(null);
  const [error, setError] = React.useState<null | string>(null);
  const [iceServers, setIceServers] = React.useState<null | IceServers>(null);

  React.useEffect(() => {
    const fetchIceServers = async (gameToken: string) => {
      try {
        const servers = await xirsysService.getIceServers(gameToken);

        setIceServers(servers);
      } catch (e) {
        setError(e.message);
      }
    };

    if (token && !iceServers) {
      fetchIceServers(token);
    }
  }, [token, iceServers]);

  React.useEffect(() => {
    if (!peerClient && iceServers) {
      const port =
        // eslint-disable-next-line no-undef
        process && process.env.NODE_ENV === 'development' ? 3333 : 443;

      logger.log(`using port ${port}`);

      const peer = new Peer({
        host: '/',
        port: port,
        debug: 2,
        path: '/api/peerjs',
        config: {
          iceServers: [
            {
              username: iceServers.username,
              urls: iceServers.urls,
              credential: iceServers.credential,
            },
          ],
        },
      });

      peer.on('error', (error) => {
        logger.error('peer error', error.message);

        setError(error.message);
      });

      peer.on('open', () => {
        logger.log(`opened peer connection with id ${peer.id}`);

        setPeerClient(peer);
      });

      peer.on('close', () => {
        logger.log('peer client closed');
      });

      peer.on('disconnected', () => {
        logger.log('peer client disconnected');
      });
    }

    return () => {
      if (peerClient) {
        logger.log(`disconnecting peer`);

        if (onLeave) {
          logger.log(`calling peer leave callback`);

          onLeave(peerClient);
        }

        peerClient.destroy();
      }
    };
  }, [peerClient, onLeave, iceServers]);

  const returnedTuple: [Peer | null, string | null] = React.useMemo(
    () => [peerClient, error],
    [peerClient, error]
  );

  return returnedTuple;
};

export default usePeer;
