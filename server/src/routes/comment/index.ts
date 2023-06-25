import commentController from '@/controllers/comment.controller';
import {
  catchError,
  checkParamsId,
  checkUser,
  validateRequest,
} from '@/middleware/validate';
import {
  createCommentSchema,
  getCommentByUserSchema,
  getCommentSchema,
  updateCommentSchema,
} from '@/schema/comment.schema';
import express from 'express';

const router = express.Router();

router.get(
  '/',
  validateRequest(getCommentSchema),
  catchError(commentController.getComments),
);

router.get(
  '/user',
  checkUser,
  validateRequest(getCommentByUserSchema),
  catchError(commentController.getCommentsByUser),
);

router.post(
  '/create',
  checkUser,
  validateRequest(createCommentSchema),
  catchError(commentController.createComment),
);

router.put(
  '/update/:id',
  checkUser,
  checkParamsId,
  validateRequest(updateCommentSchema),
  catchError(commentController.updateComment),
);

export default router;
