import mongoose from 'mongoose';
import { ROLE_LIST } from '../../shared/config/constants.js';

const userSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true, trim: true },
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role:         { type: String, enum: ROLE_LIST, required: true },
    isActive:     { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const User = mongoose.model('User', userSchema);
