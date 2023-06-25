import { Schema, model, Document, Types, SchemaTypes } from 'mongoose';

export interface IPost {
  title: string;
  content: string;
  background?: string;
  cmt_count?: number;
  authorId?: Types.ObjectId;
  isDelete?: boolean;
  tags: string[];
}

export interface PostDocument extends IPost, Document<Types.ObjectId> {
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    authorId: {
      type: SchemaTypes.ObjectId,
      required: true,
      ref: 'users',
    },
    content: {
      type: String,
      maxlength: 700,
      required: true,
    },
    title: {
      type: String,
      maxlength: 40,
      required: true,
    },
    cmt_count: {
      type: Number,
      default: 0,
      required: true,
    },
    background: {
      type: String,
      default: '',
    },
    tags: { type: [String], default: [] },
    isDelete: { type: Boolean, default: false, required: true },
  },
  { timestamps: true, collection: 'posts' },
);
postSchema.index({ content: 'text', title: 'text' });

const Post = model<IPost>('posts', postSchema);

export default Post;
