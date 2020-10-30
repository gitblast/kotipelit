import mongoose, { Schema } from 'mongoose';
import { UserModel } from '../types';

const userSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  channelName: { type: String, required: true },
  joinDate: { type: String, required: true },
});

interface JSONUserModel extends Omit<UserModel, 'email' | 'passwordHash'> {
  email?: string;
  passwordHash?: string;
}

userSchema.set('toJSON', {
  transform: (_document, returnedObject: JSONUserModel) => {
    delete returnedObject.__v;
    delete returnedObject.email;
    delete returnedObject.passwordHash;
  },
});

export default mongoose.model<UserModel>('User', userSchema);
