import { Document, Model, Schema, model, models } from 'mongoose';

import AuthService from '@src/services/auth.service';
import logger from '@src/logger';

export interface User {
  _id?: string;
  name: string;
  email: string;
  password?: string;
}

interface UserModel extends Omit<User, '_id'>, Document {}

export enum CUSTOM_VALIDATION {
  DUPLICATED = 'DUPLICATED',
}

const schema = new Schema<UserModel>(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: [true, 'Email must be unique'],
    },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret): void => {
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

schema.path('email').validate(
  async (email: string) => {
    const emailCount = await models.User.countDocuments({ email });
    return !emailCount;
  },
  'already exists in the database',
  CUSTOM_VALIDATION.DUPLICATED
);

schema.pre<UserModel>('save', async function (): Promise<void> {
  if (!this.password || !this.isModified('password')) {
    return;
  }

  try {
    const hashedPassword = await AuthService.hashPassword(this.password);
    this.password = hashedPassword;
  } catch (error) {
    logger.error(`Error hashing the password for use ${this.name}`);
  }
});

export const User: Model<UserModel> = model('User', schema);
