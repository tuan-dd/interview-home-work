import { BadRequestError, CreatedResponse, SuccessResponse } from '@/helpers/utils';
import { IPost } from '@/models/Post';
import { CreatePostSchema, GetPostSchema, UpdatePostSchema } from '@/schema/post.schema';
import postService from '@/services/post.service';
import {
  convertStringToObjectId,
  getConvertCreatedAt,
  getDeleteFilter,
} from '@/utils/otherUtil';
import { Request, Response } from 'express';

class PostController {
  createPost = async (req: Request<any, any, CreatePostSchema>, res: Response) => {
    const { content, title, background, tags } = req.body;
    const authorId = req.userId;
    const post: IPost = {
      authorId,
      content,
      title,
      background: background || '',
      tags: tags || [],
    };

    const result = await postService.createOne(post);

    const populate = await result.populate({ path: 'authorId', select: 'name avatar' });

    new CreatedResponse({
      message: 'Create post successfully',
      data: getDeleteFilter(['isDelete'], populate.toJSON()),
    }).send(res);
  };

  updatePost = async (req: Request<any, any, UpdatePostSchema>, res: Response) => {
    const postId = convertStringToObjectId(req.params.id);

    if (req.body.isDelete) {
      const result = await postService.findByIdUpdate(
        postId,
        { $set: { isDelete: true } },
        { new: true },
      );
      if (!result) throw new BadRequestError('Not found post');

      return new SuccessResponse({ message: 'Delete post successfully' }).send(res);
    }

    const result = await postService.findOneUpdate(
      { _id: postId, isDelete: false },
      { $set: { ...req.body } },
      { new: true },
    );

    if (!result) throw new BadRequestError('Not found post');

    new SuccessResponse({ message: 'Update post successfully' }).send(res);
  };

  getPosts = async (req: Request<any, any, any, GetPostSchema>, res: Response) => {
    let query = req.query;

    const queryAuthor = req.query.author;

    query = getDeleteFilter(['page', 'limit', 'author'], query);

    query = getConvertCreatedAt(query, ['title', 'content']);

    const page = req.query.page || 1;
    const limit = req.query.limit || 15;

    if (queryAuthor) {
      const regExp = new RegExp(queryAuthor, 'i');
      const posts = await postService.findManyAndPopulateByQuery(
        { query: { ...query, isDelete: false }, page, limit },
        [{ path: 'authorId', match: { name: regExp }, select: 'name avatar' }],
        '-isDelete',
      );

      const convertPosts = posts.filter((post) => post.authorId);

      const count = await postService.getCountByQuery({ ...query, isDelete: false });

      return new SuccessResponse({
        message: 'Get post successfully',
        data: { posts: convertPosts, count },
      }).send(res);
    }

    const posts = await postService.findManyAndPopulateByQuery(
      { query: { ...query, isDelete: false }, page, limit },
      [{ path: 'authorId', select: 'name avatar' }],
      '-isDelete',
    );

    const count = await postService.getCountByQuery({ ...query, isDelete: false });

    new SuccessResponse({
      message: 'Get post successfully',
      data: { posts, count },
    }).send(res);
  };

  getPostByUser = async (req: Request<any, any, any, GetPostSchema>, res: Response) => {
    const authorId = req.userId;
    let query = req.query;

    query = getDeleteFilter(['page', 'limit', 'author'], query);

    query = getConvertCreatedAt(query, ['title', 'content']);

    const page = req.query.page || 1;
    const limit = req.query.limit || 15;

    const posts = await postService.findMany(
      {
        query: { ...query, authorId, isDelete: false },
        page,
        limit,
      },
      '-isDelete',
    );

    const count = await postService.getCountByQuery({ ...query });

    new SuccessResponse({
      message: 'Get post successfully',
      data: { posts, count },
    }).send(res);
  };
}

const postController = new PostController();
export default postController;
