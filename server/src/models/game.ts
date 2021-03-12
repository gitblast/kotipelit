/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import mongoose, { Schema } from 'mongoose';
import { GameStatus, GameModel } from '../types';

const gameSchema: Schema = new Schema(
  {
    type: { type: String, required: true },
    info: { type: Object, required: true },
    startTime: { type: Date, required: true },
    players: { type: Array, required: true },
    status: { type: GameStatus, required: true },
    host: {
      id: { type: mongoose.Types.ObjectId, required: true },
      displayName: { type: String, required: true },
      privateData: {
        twilioToken: { type: String },
      },
    },
    createDate: { type: Date, required: true },
    rounds: Number,
    price: { type: Number, required: true },
  },
  { minimize: false }
); // minimize omits empty objects (causes errors in kotitonni answers)

gameSchema.set('toJSON', {
  transform: (_document: unknown, returnedObject: GameModel) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default mongoose.model<GameModel>('Game', gameSchema);
