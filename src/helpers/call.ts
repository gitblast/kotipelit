import logger from '../utils/logger';

import { MediaConnection } from 'peerjs';

const attachCallListeners = (
  call: MediaConnection,
  onCall: (call: MediaConnection, stream: MediaStream) => void
) => {
  call.on('stream', (stream) => {
    logger.log(`recieving stream from ${call.peer}`);

    onCall(call, stream);
  });

  call.on('error', (error) => {
    logger.error('call error:', error.message);
  });

  call.on('close', () => {
    logger.log(`call closed with peer ${call.peer}`);
  });
};

export default {
  attachCallListeners,
};
