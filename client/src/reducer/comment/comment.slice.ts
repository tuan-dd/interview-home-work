/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EStatusRedux } from '@/utils/enum';
import { IAuthor, IComment, IPost } from '@/utils/interface';
import { ICreateCommentReq } from '../middleware/comment.saga';

interface ICommentByPost {
  [k: string]: IComment<string, IAuthor>[];
}
interface IStatusComment {
  [k: string]: EStatusRedux;
}

interface ICommentRedux {
  status: EStatusRedux;
  statusCommentByPost: IStatusComment;
  commentsByUser: IComment<IPost, string>[];
  commentsByPost: ICommentByPost;
  count: number;
  errorMessage: string;
}

const initialState: ICommentRedux = {
  statusCommentByPost: {},
  status: EStatusRedux.idle,
  commentsByUser: [],
  commentsByPost: {},
  count: 0,
  errorMessage: '',
};

export interface IUpdateComment {
  _id: string;
  postId: string;
  content: string;
  indexComment: number;
  message?: string;
}

export interface IUpdateReply extends IUpdateComment {
  indexReply: number;
}

interface IReplies {
  replies: IComment<string, IAuthor>[];
  postId: string;
  parentSlug: string;
  message?: string;
}

export interface IGetComments {
  postId: string;
  comments: IComment<string, IAuthor>[];
  page: number;
  message?: string;
}

interface IGetCommentsByUser {
  count: number;
  comments: IComment<IPost, string>[];
}

interface ICreateCommentRes {
  comment: IComment<string, IAuthor>;
  message: string;
  postId: string;
  parentSlug?: string;
}

export interface IDeleteCommentByPost {
  _id: string;
  postId: string;
  indexComment: number;
  message?: string;
}
export interface IDeleteReplyByPost extends IDeleteCommentByPost {
  indexReply: number;
}

export const commentSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    getCommentsPending: (state, action: PayloadAction<IGetComments>) => {
      state.statusCommentByPost[action.payload.postId] = EStatusRedux.pending;
      state.errorMessage = '';
    },
    getRepliesPending: (state, _action: PayloadAction<IReplies>) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    },
    getCommentsByUserPending: (state, _action: PayloadAction<IGetCommentsByUser>) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    },
    createCommentPending: (state, action: PayloadAction<ICreateCommentReq>) => {
      state.statusCommentByPost[action.payload.postId] = EStatusRedux.pending;
      state.errorMessage = '';
    },
    updateCommentPending: (state, _action: PayloadAction<IUpdateComment>) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    },
    updateReplyPending: (state, _action: PayloadAction<IUpdateReply>) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    },
    deleteCommentPending: (state, _action: PayloadAction<IDeleteCommentByPost>) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    },
    deleteReplyPending: (state, _action: PayloadAction<IDeleteReplyByPost>) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    },
    deleteCommentByUserPending: (state, _action: PayloadAction<string>) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    },

    getCommentsSuccess: (state, action: PayloadAction<IGetComments>) => {
      state.statusCommentByPost[action.payload.postId] = EStatusRedux.succeeded;
      const { comments, postId } = action.payload;
      if (!state.commentsByPost[postId] || action.payload.page === 1) {
        state.commentsByPost[postId] = comments;
      } else {
        state.commentsByPost[postId] = [...state.commentsByPost[postId], ...comments];
      }
    },
    getRepliesSuccess: (state, action: PayloadAction<IReplies>) => {
      state.status = EStatusRedux.succeeded;
      const { replies, postId, parentSlug } = action.payload;
      if (state.commentsByPost[postId]) {
        const comments = state.commentsByPost[postId];
        const index = comments.findIndex((comment) => comment.slug === parentSlug);
        if (index > -1) {
          if (Array.isArray(comments[index].replies)) {
            comments[index].replies = comments[index].replies?.concat(replies);
          } else {
            comments[index].replies = replies;
          }
        }

        state.commentsByPost[postId] = comments;
      }
    },
    getCommentsByUserSuccess: (state, action: PayloadAction<IGetCommentsByUser>) => {
      state.status = EStatusRedux.succeeded;
      if (action.payload.count === 1) {
        state.commentsByUser = action.payload.comments;
      } else {
        state.commentsByUser = state.commentsByUser.concat(action.payload.comments);
      }
      state.count = action.payload.count;
    },
    createCommentSuccess: (state, action: PayloadAction<ICreateCommentRes>) => {
      const { parentSlug, postId, comment } = action.payload;
      state.statusCommentByPost[postId] = EStatusRedux.succeeded;
      if (state.commentsByPost[postId]) {
        if (!parentSlug) {
          state.commentsByPost[postId].unshift(comment);
        } else {
          state.commentsByPost[postId].forEach((commentByPost) => {
            if (commentByPost.slug === parentSlug) {
              if (commentByPost.replies) {
                commentByPost.replies?.unshift(commentByPost);
              } else {
                commentByPost.replies = [comment];
              }
              commentByPost.reply_count += 1;
            }
          });
        }
      }
    },
    updateCommentSuccess: (state, action: PayloadAction<IUpdateComment>) => {
      state.status = EStatusRedux.succeeded;
      const { postId, content, indexComment } = action.payload;

      if (state.commentsByPost[postId]) {
        state.commentsByPost[postId][indexComment].content = content;
      }
    },
    updateReplySuccess: (state, action: PayloadAction<IUpdateReply>) => {
      state.status = EStatusRedux.succeeded;
      const { postId, content, indexComment, indexReply } = action.payload;

      if (state.commentsByPost[postId]) {
        const comment = state.commentsByPost[postId][indexComment];

        if (comment.replies) {
          comment.replies[indexReply].content = content;
        }
        state.commentsByPost[postId][indexComment] = comment;
      }
    },
    deleteCommentSuccess: (state, action: PayloadAction<IDeleteCommentByPost>) => {
      state.status = EStatusRedux.succeeded;
      const { postId, indexComment } = action.payload;

      if (state.commentsByPost[postId]) {
        state.commentsByPost[postId].splice(indexComment, 1);
      }
    },
    deleteReplySuccess: (state, action: PayloadAction<IDeleteReplyByPost>) => {
      state.status = EStatusRedux.succeeded;
      const { postId, indexComment, indexReply } = action.payload;

      if (state.commentsByPost[postId]) {
        if (state.commentsByPost[postId][indexComment]) {
          state.commentsByPost[postId][indexComment].replies?.splice(indexReply, 1);
        }
      }
    },
    deleteCommentByUser: (state, action: PayloadAction<string>) => {
      state.status = EStatusRedux.succeeded;
      state.commentsByUser = state.commentsByUser.filter(
        (Comment) => Comment._id !== action.payload,
      );
    },

    getCommentsError: (state, action: PayloadAction<IGetComments>) => {
      state.statusCommentByPost[action.payload.postId] = EStatusRedux.error;
      state.errorMessage = action.payload.message || 'Some thing wrong';
    },
    getRepliesError: (state, action: PayloadAction<IReplies>) => {
      state.statusCommentByPost[action.payload.postId] = EStatusRedux.error;
      state.errorMessage = action.payload.message || 'Some thing wrong';
    },
    getCommentsByUserError: (state, action: PayloadAction<string>) => {
      state.status = EStatusRedux.error;
      state.errorMessage = action.payload || 'Some thing wrong';
    },
    createCommentError: (state, action: PayloadAction<ICreateCommentRes>) => {
      state.statusCommentByPost[action.payload.postId] = EStatusRedux.error;
      state.errorMessage = action.payload.message || 'Some thing wrong';
    },
    updateCommentError: (state, action: PayloadAction<IUpdateComment>) => {
      state.status = EStatusRedux.error;
      state.errorMessage = action.payload.message || 'Some thing wrong';
    },
    updateReplyError: (state, action: PayloadAction<IUpdateReply>) => {
      state.status = EStatusRedux.error;
      state.errorMessage = action.payload.message || 'Some thing wrong';
    },
    deleteCommentError: (state, action: PayloadAction<IDeleteCommentByPost>) => {
      state.status = EStatusRedux.error;
      state.errorMessage = action.payload.message || 'Some thing wrong';
    },
    deleteReplyError: (state, action: PayloadAction<IDeleteReplyByPost>) => {
      state.status = EStatusRedux.error;
      state.errorMessage = action.payload.message || 'Some thing wrong';
    },
    deleteCommentByUserError: (state, action: PayloadAction<string>) => {
      state.status = EStatusRedux.error;
      state.errorMessage = action.payload || 'Some thing wrong';
    },
  },
});

export const commentAction = commentSlice.actions;
export default commentSlice.reducer;
