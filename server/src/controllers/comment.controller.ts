import { BadRequestError, CreatedResponse, SuccessResponse } from '@/helpers/utils';
import { IComment } from '@/models/Comment';
import {
  CreateCommentSchema,
  GetCommentByUserSchema,
  GetCommentSchema,
  UpdateCommentSchema,
} from '@/schema/comment.schema';
import commentService from '@/services/comment.service';
import postService from '@/services/post.service';
import { convertStringToObjectId, getDeleteFilter } from '@/utils/otherUtil';
import { Request, Response } from 'express';

class CommentController {
  createComment = async (req: Request<any, any, CreateCommentSchema>, res: Response) => {
    const authorId = req.userId;
    const { content, parentSlug, postId } = req.body;

    const newComment: IComment = {
      authorId,
      content,
      postId: convertStringToObjectId(postId),
      parentSlug: parentSlug || '',
      slug: !parentSlug ? Date.now().toString() : `${parentSlug}/${Date.now()}`,
    };

    const postDb = await postService.findById(postId, null, { lean: false });

    if (!postDb && postDb.isDelete) throw new BadRequestError('Not found post');

    if (parentSlug) {
      const commentParent = await commentService.findOneUpdate(
        { slug: parentSlug, isDelete: false },
        { $inc: { reply_count: 1 } },
        {
          new: true,
        },
      );

      if (!commentParent) throw new BadRequestError('Not found comment parent');
    }

    const createComment = await commentService.createOne(newComment);

    if (!parentSlug) {
      postDb.cmt_count += 1;

      await postDb.save();
    }

    new CreatedResponse({
      message: 'Create comment successfully',
      data: getDeleteFilter(['isDelete'], createComment.toJSON()),
    }).send(res);
  };

  updateComment = async (req: Request<any, any, UpdateCommentSchema>, res: Response) => {
    const authorId = req.userId;
    const commentId = convertStringToObjectId(req.params.id);
    const { content, isDelete } = req.body;

    if (isDelete) {
      const result = await commentService.findOneUpdate(
        { _id: commentId, authorId, isDelete: false },
        { $set: { isDelete: true } },
      );

      if (!result) throw new BadRequestError('Not found comment');

      if (!result.parentSlug) {
        const regExp = new RegExp(result.slug, 'i');

        await postService.findByIdUpdate(result.postId, { $inc: { cmt_count: -1 } });

        // parent comment delete all reply delete true
        await commentService.updateMany(
          { slug: regExp },
          { $set: { isDelete: true } },
          { multi: true },
        );
      } else {
        await commentService.findOneUpdate(
          { slug: result.parentSlug },
          { $inc: { reply_count: -1 } },
        );
      }

      return new SuccessResponse({ message: 'Delete comment successfully' }).send(res);
    }

    const result = await commentService.findOneUpdate(
      { _id: commentId, authorId, isDelete: false },
      { $set: { content } },
      { new: true },
    );

    if (!result || result.isDelete) throw new BadRequestError('Not found comment');

    return new SuccessResponse({ message: 'Update comment successful' }).send(res);
  };

  getCommentsByUser = async (
    req: Request<any, any, any, GetCommentByUserSchema>,
    res: Response,
  ) => {
    const authorId = req.userId;

    const page = req.query.page || 1;
    const limit = req.query.limit || 5;

    const comments = await commentService.getCommentByUser(authorId, page, limit);

    return new SuccessResponse({
      message: 'Get comments successful',
      data: { comments },
    }).send(res);
  };

  getComments = async (req: Request<any, any, any, GetCommentSchema>, res: Response) => {
    const postId = convertStringToObjectId(req.query.postId);
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const parentSlug = req.query.parentSlug;

    const postDb = await postService.findById(postId);

    if (!postDb && postDb.isDelete) throw new BadRequestError('Not found post');

    if (parentSlug) {
      const regExp = new RegExp(parentSlug, 'i');
      const comments = await commentService.findManyAndPopulateByQuery(
        {
          query: { slug: regExp, postId, isDelete: false },
          page,
          limit,
        },
        [{ path: 'authorId', select: 'name avatar' }],
      );

      const parentComment = comments.find((comment) => !comment.parentSlug);

      return new SuccessResponse({
        message: 'Get replies successful',
        data: {
          replies: comments.filter((comment) => comment.parentSlug),
          count: parentComment?.reply_count || 0,
        },
      }).send(res);
    }

    const comments = await commentService.findManyAndPopulateByQuery(
      {
        query: { postId, isDelete: false, parentSlug: '' },
        page,
        limit,
      },
      [{ path: 'authorId', select: 'name avatar' }],
    );

    return new SuccessResponse({
      message: 'Get comments successful',
      data: { comments, count: postDb.cmt_count },
    }).send(res);
  };
}

const commentController = new CommentController();
export default commentController;
