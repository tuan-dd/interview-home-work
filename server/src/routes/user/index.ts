import userController from '@/controllers/user.controller';
import { catchError, checkUser, validateRequest } from '@/middleware/validate';
import { updateUserSchema } from '@/schema/user.schema';
import express from 'express';

const router = express.Router();

router.use(checkUser);

router.put(
  '/update/me',
  validateRequest(updateUserSchema),
  catchError(userController.updateMe),
);

router.get('/me', catchError(userController.getMe));

export default router;
