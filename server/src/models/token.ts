import mongoose, { Schema } from 'mongoose';
import { TokenModel } from '../types';

/** used in password resetting */

const tokenSchema = new Schema({
  userId: { type: String, required: true },
  token: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // valid for one hour
  },
});

export default mongoose.model<TokenModel>('Token', tokenSchema);
