import postController from '@/controllers/post.controller';
import {
  catchError,
  checkParamsId,
  checkUser,
  validateRequest,
} from '@/middleware/validate';
import { createPostSchema, getPostSchema, updatePostSchema } from '@/schema/post.schema';
import express from 'express';

const router = express.Router();

router.get('/', validateRequest(getPostSchema), catchError(postController.getPosts));

router.get(
  '/user',
  checkUser,
  validateRequest(getPostSchema),
  catchError(postController.getPostByUser),
);

router.post(
  '/create',
  checkUser,
  validateRequest(createPostSchema),
  catchError(postController.createPost),
);

router.put(
  '/update/:id',
  checkParamsId,
  checkUser,
  validateRequest(updatePostSchema),
  catchError(postController.updatePost),
);

export default router;
