import mongoose, { Schema, Document } from 'mongoose';

interface UserModel extends Document {
  username: string;
  email: string;
  passwordHash: string;
  channelName: string;
  joinDate: Date;
}

/** @TODO games ? */

const userSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  channelName: String,
  joinDate: Date,
});

userSchema.set('toJSON', {
  transform: (_document, returnedObject: UserModel) => {
    delete returnedObject.__v;
    delete returnedObject.email;
    delete returnedObject.passwordHash;
  },
});

export default mongoose.model<UserModel>('User', userSchema);
