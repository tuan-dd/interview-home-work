import { Types, Schema, model, SchemaTypes } from 'mongoose';

export interface ISecretKey {
  userId: Types.ObjectId;
  secretKey: string;
  isActive: boolean;
}

const secretKeySchema = new Schema<ISecretKey>(
  {
    userId: {
      type: SchemaTypes.ObjectId,
      required: true,
      index: true,
      unique: true,
      ref: 'users',
    },
    secretKey: {
      type: String,
      required: true,
    },
    isActive: { type: Boolean, default: false, required: true },
  },
  { timestamps: true, collection: 'keyStores' },
);

const SecretKey = model<ISecretKey>('keyStores', secretKeySchema);
export default SecretKey;
