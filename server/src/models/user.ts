import mongoose, { Schema } from 'mongoose';
import { UserModel } from '../types';

const userSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  birthYear: { type: Number, required: true },
  confirmationId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  joinDate: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'active'],
    default: 'pending',
  },
});

userSchema.set('toJSON', {
  transform: (_document: unknown, returnedObject: UserModel) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.email;
    delete returnedObject.birthYear;
    delete returnedObject.passwordHash;
    delete returnedObject.confirmationId;
    delete returnedObject.lastName;
    delete returnedObject.status;
  },
});

export default mongoose.model<UserModel>('User', userSchema);
