import mongoose, { Schema, Document } from 'mongoose';
import { GameType, GamePlayer } from '../types';
import { UserModel } from './user';

/** @TODO types for all fields */

export interface GameModel extends Document {
  type: GameType;
  startTime: Date;
  players: GamePlayer[];
  host: UserModel['_id'];
  createDate: Date;
}

/** @TODO winner? rating? url? name? jitsiroom? */

const gameSchema: Schema = new Schema({
  type: { type: String, required: true },
  startTime: { type: Date, required: true },
  players: { type: Array, required: true },
  host: { type: mongoose.Types.ObjectId, required: true },
  createDate: { type: Date, required: true },
});

gameSchema.set('toJSON', {
  transform: (_document, returnedObject: GameModel) => {
    delete returnedObject.__v;
  },
});

export default mongoose.model<GameModel>('Game', gameSchema);
