import express from 'express';
import { getLogger } from '@/utils/loggers';
const router = express.Router();
const logger = getLogger('INDEX_ROUTE');
import authRouter from './auth';
import commentRouter from './comment';
import postRouter from './post';
import userRouter from './user';

/* GET home page. */
router.get('/', function (_req, res) {
  logger.info('hello Express');
  res.send('Welcome Backend Rest-full api by Tuan');
});

router.use('/v1/api/auth', authRouter);
router.use('/v1/api/comment', commentRouter);
router.use('/v1/api/post', postRouter);
router.use('/v1/api/user', userRouter);

export default router;

