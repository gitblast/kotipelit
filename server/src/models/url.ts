import mongoose, { Schema } from 'mongoose';
import { UrlModel } from '../types';

const urlSchema: Schema = new Schema({
  hostName: { type: String, required: true },
  gameId: { type: String, required: true },
  playerId: { type: String, required: true },
  inviteCode: { type: String, required: true },
});

interface JSONUrlModel extends Omit<UrlModel, 'inviteCode'> {
  inviteCode?: 'string';
}

urlSchema.set('toJSON', {
  transform: (_document: unknown, returnedObject: JSONUrlModel) => {
    delete returnedObject.__v;
    delete returnedObject._id;
    delete returnedObject.inviteCode;
  },
});

export default mongoose.model<UrlModel>('Url', urlSchema);
