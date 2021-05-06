import Game from '../models/game';
import { Server } from 'socket.io';
import { ObjectId } from 'mongoose';
import { RTCGame, FilteredRTCGame } from '../types';

const filterChanges = (changes: Partial<RTCGame>) => {
  const filtered: Partial<FilteredRTCGame> = {
    ...changes,
  };

  if (filtered.players) {
    filtered.players = filtered.players.map((player) => ({
      ...player,
      privateData: null,
    }));
  }

  return filtered;
};

export const setupChangeStreams = (io: Server) => {
  Game.watch().on('change', (data) => {
    if (data.operationType === 'update') {
      const objId = data.documentKey._id as ObjectId;

      const gameId = objId.toString();

      console.log('game id', gameId);

      console.log('updated fields:', data.updateDescription.updatedFields);

      const update = filterChanges(data.updateDescription.updatedFields);

      io.of('/').to(gameId).emit('testing', update);
    }
  });
};
