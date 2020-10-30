/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import mongoose, { Schema } from 'mongoose';
import { GameStatus, GameModel, GamePlayer } from '../types';

const gameSchema: Schema = new Schema({
  type: { type: String, required: true },
  startTime: { type: Date, required: true },
  players: { type: Array, required: true },
  status: { type: GameStatus, required: true },
  host: { type: mongoose.Types.ObjectId, required: true },
  createDate: { type: Date, required: true },
  rounds: Number,
  price: { type: Number, required: true },
});

interface JSONGamePlayer extends Omit<GamePlayer, 'inviteCode'> {
  inviteCode?: string;
}

interface JSONGameModel extends Omit<GameModel, 'players'> {
  players: JSONGamePlayer[];
}

gameSchema.set('toJSON', {
  transform: (_document, returnedObject: JSONGameModel) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    returnedObject.players = returnedObject.players.map((player) => {
      const mapped = { ...player };

      if (process.env.NODE_ENV !== 'development') {
        delete mapped.inviteCode;
      }

      return mapped;
    });
  },
});

export default mongoose.model<GameModel>('Game', gameSchema);
