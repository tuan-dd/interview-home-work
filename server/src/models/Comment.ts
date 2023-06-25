import { Types, Schema, model, SchemaTypes, Document } from 'mongoose';

export interface IComment {
  content: string;
  postId: Types.ObjectId;
  slug?: string;
  parentSlug: string;
  authorId: Types.ObjectId;
  reply_count?: number;
  isDelete?: boolean;
}

export interface CommentDocument extends IComment, Document<Types.ObjectId> {
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema: Schema<CommentDocument> = new Schema<IComment>(
  {
    postId: {
      type: SchemaTypes.ObjectId,
      required: true,
      ref: 'posts',
    },
    content: {
      type: String,
      required: true,
    },
    slug: {
      type: String, // Date().getTime
      required: true,
      index: true,
      unique: true,
    },
    parentSlug: {
      type: String,
      default: '',
    },
    authorId: {
      type: SchemaTypes.ObjectId,
      required: true,
      ref: 'users',
    },
    reply_count: {
      type: Number,
      required: true,
      default: 0,
    },
    isDelete: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true, collection: 'comments' },
);

const Comment = model<IComment>('comments', commentSchema);
export default Comment;
