import mongoose, { Schema } from 'mongoose';
import { UserModel } from '../types';

const userSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 12,
    },
    firstName: { type: String, required: true, maxlength: 16 },
    lastName: { type: String, required: true, maxlength: 25 },
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
  },
  {
    collation: {
      locale: 'fi',
      strength: 2,
    },
  }
);

userSchema.set('toJSON', {
  transform: (_document: unknown, returnedObject: Partial<UserModel>) => {
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
