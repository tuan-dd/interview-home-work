/* eslint-disable @typescript-eslint/no-explicit-any */
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';

import { PayloadAction } from '@reduxjs/toolkit';
import {
  fetchCreateComment,
  fetchDeleteComment,
  fetchGetComments,
  fetchUpdateComment,
} from '@/api/comment.api';
import {
  IDeleteCommentByPost,
  IDeleteReplyByPost,
  IUpdateComment,
  IUpdateReply,
  commentAction,
} from '../comment/comment.slice';
import { IAuthor, IComment } from '@/utils/interface';
import { postAction } from '../post/post.slice';

interface IQueryComments {
  postId: string;
  page: number;
}

interface IQueryReplies extends IQueryComments {
  parentSlug: string;
}

export interface ICreateCommentReq {
  content: string;
  postId: string;
  parentSlug?: string;
  author: IAuthor;
}

interface IResponseComments {
  comments: IComment<string, IAuthor>[];
  count: number;
}
interface IResponseReplies {
  replies: IComment<string, IAuthor>[];
  count: number;
}

function* handelGetComments(props: PayloadAction<IQueryComments>) {
  try {
    const data: IResponseComments | null = yield call(fetchGetComments, {
      ...props.payload,
      limit: 3,
    });
    if (data) {
      yield put(
        commentAction.getCommentsSuccess({
          comments: data.comments,
          postId: props.payload.postId,
          page: props.payload.page,
        }),
      );
    }
  } catch (error: any) {
    yield put(
      commentAction.getCommentsError({
        comments: [],
        postId: props.payload.postId,
        page: props.payload.page,
        message: error.message,
      }),
    );
  }
}

function* handelGetReplies(props: PayloadAction<IQueryReplies>) {
  try {
    const data: IResponseReplies | null = yield call(fetchGetComments, {
      ...props.payload,
      limit: 20,
    });
    if (data) {
      yield put(
        commentAction.getRepliesSuccess({
          replies: data.replies,
          postId: props.payload.postId,
          parentSlug: props.payload.parentSlug,
        }),
      );
    }
  } catch (error: any) {
    yield put(commentAction.getRepliesError(error.message));
  }
}

function* handelCreateCommentOrReply(props: PayloadAction<ICreateCommentReq>) {
  try {
    const data: IComment<string, IAuthor> | null = yield call(
      fetchCreateComment,
      props.payload,
    );

    if (data) {
      const dataComments: IResponseComments | null = yield call(fetchGetComments, {
        page: 1,
        postId: props.payload.postId,
        limit: 3,
      });
      if (dataComments)
        yield put(
          commentAction.getCommentsSuccess({
            comments: dataComments.comments,
            postId: props.payload.postId,
            page: 1,
          }),
        );
      if (data.parentSlug) {
        data.authorId = props.payload.author;
        yield put(
          commentAction.createCommentSuccess({
            comment: data,
            postId: props.payload.postId,
            parentSlug: props.payload.parentSlug,
            message: '',
          }),
        );
      }
    }
  } catch (error: any) {
    yield put(commentAction.createCommentError(error.message));
  }
}

function* handelUpdateComment(props: PayloadAction<IUpdateComment>) {
  try {
    const data: IComment<string, IAuthor>[] | null = yield call(fetchUpdateComment, {
      isDelete: false,
      commentId: props.payload._id,
      content: props.payload.content,
    });
    if (data) {
      yield put(commentAction.updateCommentSuccess(props.payload));
    }
  } catch (error: any) {
    yield put(commentAction.updateReplyError(error.message));
  }
}

function* handelUpdateReply(props: PayloadAction<IUpdateReply>) {
  try {
    const data: IComment<string, IAuthor>[] | null = yield call(fetchUpdateComment, {
      isDelete: false,
      commentId: props.payload._id,
      content: props.payload.content,
    });
    if (data) {
      yield put(commentAction.updateReplySuccess(props.payload));
    }
  } catch (error: any) {
    yield put(commentAction.updateReplyError(error.message));
  }
}

function* handelDeleteComment(props: PayloadAction<IDeleteCommentByPost>) {
  try {
    const data: string | null = yield call(fetchDeleteComment, props.payload._id);
    if (data) {
      yield put(postAction.updateCountPost({ postId: props.payload.postId, count: -1 }));
      yield put(commentAction.deleteCommentSuccess(props.payload));
    }
  } catch (error: any) {
    yield put(commentAction.deleteCommentError(error.message));
  }
}

function* handelDeleteReply(props: PayloadAction<IDeleteReplyByPost>) {
  try {
    const data: IComment<string, IAuthor>[] | null = yield call(
      fetchDeleteComment,
      props.payload._id,
    );
    if (data) {
      yield put(commentAction.deleteReplySuccess(props.payload));
    }
  } catch (error: any) {
    yield put(commentAction.deleteReplyError(error.message));
  }
}

export default function* commentSaga() {
  yield takeLatest(commentAction.getCommentsPending.toString(), handelGetComments);
  yield takeLatest(commentAction.getRepliesPending.toString(), handelGetReplies);
  yield takeLatest(
    commentAction.createCommentPending.toString(),
    handelCreateCommentOrReply,
  );
  yield takeEvery(commentAction.updateCommentPending.toString(), handelUpdateComment);
  yield takeEvery(commentAction.updateReplyPending.toString(), handelUpdateReply);
  yield takeEvery(commentAction.deleteCommentPending.toString(), handelDeleteComment);
  yield takeEvery(commentAction.deleteReplyPending.toString(), handelDeleteReply);
}
