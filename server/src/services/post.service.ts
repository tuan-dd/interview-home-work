import Post, { IPost, PostDocument } from '@/models/Post';
import BaseService from './base.service';

class PostService extends BaseService<IPost, PostDocument> {
  constructor() {
    super(Post);
  }
}

export default new PostService();
