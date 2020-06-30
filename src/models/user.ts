import mongoose, { Schema } from 'mongoose';
import { UserModel } from '../types';

/** @TODO games ? */

const userSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  channelName: { type: String, required: true },
  joinDate: { type: String, required: true },
});

userSchema.set('toJSON', {
  transform: (_document, returnedObject: UserModel) => {
    delete returnedObject.__v;
    delete returnedObject.email;
    delete returnedObject.passwordHash;
  },
});

export default mongoose.model<UserModel>('User', userSchema);
