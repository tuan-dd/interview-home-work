import Comment, { IComment, CommentDocument } from '@/models/Comment';
import BaseService from './base.service';
import { Types } from 'mongoose';

class CommentService extends BaseService<IComment, CommentDocument> {
  constructor() {
    super(Comment);
  }

  getCommentByUser = async (
    authorId: Types.ObjectId,
    page: number,
    limit: number,
    project?: { [key: string]: 0 | 1 },
  ) => {
    return this.model.aggregate([
      { $match: { authorId: authorId, isDelete: false } },
      { $skip: limit * (page - 1) },
      { $limit: limit },
      {
        $lookup: {
          from: 'posts',
          localField: 'postId',
          foreignField: '_id',
          as: 'postId',
        },
      },
      { $unwind: '$postId' },
      {
        $lookup: {
          from: 'users',
          localField: 'postId.authorId',
          foreignField: '_id',
          as: 'postId.authorId',
        },
      },
      { $unwind: '$postId.authorId' },
      {
        $project: {
          'postId.isDelete': 0,
          'postId.authorId.password': 0,
          'postId.authorId.isVerify': 0,
          'postId.authorId.isActive': 0,
          'postId.authorId.isHaveOtp': 0,
          'postId.authorId.email': 0,
          ...project,
        },
      },
    ]);
  };
}

export default new CommentService();
