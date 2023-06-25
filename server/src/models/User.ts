/* eslint-disable @typescript-eslint/ban-types */
import { Schema, model, Document, Model, Types } from 'mongoose';
import pwt from '@/utils/pwdUtil';
import pwdUtil from '@/utils/pwdUtil';
// const { Types, Schema } = mongoose;
export enum ERole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface IUser {
  name: string;
  email?: string;
  password: string;
  isVerify?: boolean;
  avatar?: string;
  role?: ERole;
  isHaveOtp: boolean;
  isActive?: boolean;
}
interface IUserMethods {
  isPasswordValid(password: string): Promise<boolean>;
}

export type TUserModel = Model<IUser, {}, IUserMethods>;

export interface UserDocument extends IUser, Document<Types.ObjectId> {
  createdAt: Date;
  updatedAt: Date;
  isPasswordValid(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser, TUserModel, IUserMethods>(
  {
    name: {
      type: String,
      maxlength: 30,
      required: true,
    },
    email: {
      type: String,
      maxlength: 40,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    isVerify: {
      type: Boolean,
      default: false,
      required: true,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      default: ERole.USER,
      enum: Object.values(ERole),
      required: true,
    },
    isHaveOtp: { type: Boolean, default: false, required: true },
    isActive: { type: Boolean, default: true, required: true },
  },
  { timestamps: true, collection: 'users' },
);

userSchema.pre('save', async function (this, next) {
  if (!this.isModified('password')) return next();

  const salt = await pwt.getSalt();
  const hash = await pwt.getHash(this.password, salt);
  this.password = hash;
});

userSchema.method('isPasswordValid', function isPasswordValid(password: string) {
  return pwdUtil.getCompare(password, this.password);
});

const User = model<IUser, TUserModel>('users', userSchema);

export default User;
