import logger from '../utils/logger';

import { MediaConnection } from 'peerjs';

const attachCallListeners = (
  call: MediaConnection,
  onCall: (call: MediaConnection, stream: MediaStream) => void,
  incoming?: boolean
) => {
  call.on('stream', (stream) => {
    // this triggers for every track!!! so for a stream containing audio and video triggers twice (bug in peerjs)

    logger.log(
      `recieving stream from ${incoming ? 'incoming call' : 'call made'} to '${
        call.peer
      }'`
    );

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
