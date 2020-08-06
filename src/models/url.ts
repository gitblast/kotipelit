import mongoose, { Schema } from 'mongoose';
import { UrlModel } from '../types';

const urlSchema: Schema = new Schema({
  hostName: { type: String, required: true },
  gameId: { type: String, required: true },
  playerId: { type: String, required: true },
});

urlSchema.set('toJSON', {
  transform: (_document, returnedObject: UrlModel) => {
    delete returnedObject.__v;
    delete returnedObject._id;
  },
});

export default mongoose.model<UrlModel>('Url', urlSchema);
