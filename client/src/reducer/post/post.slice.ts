/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAuthor, ICreatePost, IPost, IQueryPost, IUpdatePost } from '@/utils/interface';
import { EStatusRedux } from '@/utils/enum';
import { createToast } from '@/utils/utils';

interface IPostRedux {
  status: EStatusRedux;
  posts: IPost<IAuthor>[];
  page: number;
  count: number;
  errorMessage: string;
}

const initialState: IPostRedux = {
  status: EStatusRedux.idle,
  posts: [],
  page: 0,
  count: 0,
  errorMessage: '',
};

export interface IResGetPosts {
  posts: IPost<IAuthor>[];
  page: number;
  count: number;
}
interface IUpdateCountPost {
  count: number;
  postId: string;
}

export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    updateCountPost: (state, action: PayloadAction<IUpdateCountPost>) => {
      const indexPost = state.posts.findIndex(
        (post) => post._id === action.payload.postId,
      );
      if (indexPost > -1) {
        (state.posts[indexPost].cmt_count as number) += action.payload.count;
      }
    },

    getPostsPending: (state, _action: PayloadAction<IQueryPost>) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    },
    getPostsByUserPending: (state, _action: PayloadAction<IQueryPost>) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    },
    createPostPending: (state, _action: PayloadAction<ICreatePost>) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    },
    updatePostPending: (state, _action: PayloadAction<IUpdatePost>) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    },
    deletePostPending: (state, _action: PayloadAction<string>) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    },

    getPostsSuccess: (state, action: PayloadAction<IResGetPosts>) => {
      state.status = EStatusRedux.succeeded;
      if (action.payload.page === 1) {
        state.posts = action.payload.posts;
      } else {
        state.posts = state.posts.concat(action.payload.posts);
      }
      state.page = action.payload.page;
      state.count = action.payload.count;
    },
    getPostsByUserSuccess: (state, action: PayloadAction<IResGetPosts>) => {
      state.status = EStatusRedux.succeeded;
      if (action.payload.page === 1) {
        state.posts = action.payload.posts;
      } else {
        state.posts = state.posts.concat(action.payload.posts);
      }
      state.page = action.payload.page;
      state.count = action.payload.count;
    },
    createPostSuccess: (state, action: PayloadAction<IPost<IAuthor>>) => {
      state.status = EStatusRedux.succeeded;
      state.count += 1;
      state.posts.unshift(action.payload);
    },
    updatePostSuccess: (state, action: PayloadAction<IUpdatePost>) => {
      state.status = EStatusRedux.succeeded;
      const newUpdate = action.payload;
      const index = state.posts.findIndex((post) => action.payload.postId === post._id);

      if (index > -1) {
        const post = state.posts[index];
        const { content, background, tags, title } = newUpdate;
        post.content = content;
        post.background = background;
        post.tags = tags;
        post.title = title;
        state.posts[index] = post;
      }
      createToast('Update post success', 'success');
    },
    deletePostSuccess: (state, action: PayloadAction<string>) => {
      state.status = EStatusRedux.succeeded;
      state.posts = state.posts.filter((post) => post._id !== action.payload);
      state.count -= 1;
    },

    getPostsError: (state, action: PayloadAction<string>) => {
      state.status = EStatusRedux.error;
      state.errorMessage = action.payload || 'Some thing wrong';
    },
    getPostsByUserError: (state, action: PayloadAction<string>) => {
      state.status = EStatusRedux.error;
      state.errorMessage = action.payload || 'Some thing wrong';
    },
    createPostError: (state, action: PayloadAction<string>) => {
      state.status = EStatusRedux.error;
      state.errorMessage = action.payload || 'Some thing wrong';
    },
    updatePostError: (state, action: PayloadAction<string>) => {
      state.status = EStatusRedux.error;
      state.errorMessage = action.payload || 'Some thing wrong';
    },
    deletePostError: (state, action: PayloadAction<string>) => {
      state.status = EStatusRedux.error;
      state.errorMessage = action.payload || 'Some thing wrong';
    },
  },
});

export const postAction = postSlice.actions;
export default postSlice.reducer;
