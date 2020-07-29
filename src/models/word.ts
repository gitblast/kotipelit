import mongoose, { Schema } from 'mongoose';
import { WordModel } from '../types';

const wordSchema: Schema = new Schema({
  word: { type: String, required: true },
});

wordSchema.set('toJSON', {
  transform: (_document, returnedObject: WordModel) => {
    delete returnedObject.__v;
    delete returnedObject._id;
  },
});

export default mongoose.model<WordModel>('Word', wordSchema);
