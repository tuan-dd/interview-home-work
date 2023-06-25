/* eslint-disable @typescript-eslint/no-explicit-any */
import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { IResGetPosts, postAction } from '../post/post.slice';
import { IAuthor, ICreatePost, IPost, IQueryPost, IUpdatePost } from '@/utils/interface';
import {
  fetchCreatePost,
  fetchDeletePost,
  fetchGetPosts,
  fetchUpdatePost,
} from '@/api/post.api';
import { deleteValueNull } from '@/utils/utils';

function* handelGetPost(props: PayloadAction<IQueryPost>) {
  try {
    const deleteValue = deleteValueNull(props.payload) as IQueryPost;
    const data: IResGetPosts | null = yield call(fetchGetPosts, deleteValue);
    if (data) {
      data.page = props.payload.page;
      yield put(postAction.getPostsSuccess(data));
    }
  } catch (error: any) {
    yield put(postAction.getPostsError(error.message));
  }
}

function* handelCreatePost(props: PayloadAction<ICreatePost>) {
  try {
    const data: IPost<IAuthor> | null = yield call(fetchCreatePost, props.payload);
    if (data) {
      yield put(postAction.createPostSuccess(data));
    }
  } catch (error: any) {
    yield put(postAction.createPostError(error.message));
  }
}

function* handelUpdatePost(props: PayloadAction<IUpdatePost>) {
  try {
    const data: IPost<IAuthor> | null = yield call(fetchUpdatePost, props.payload);
    if (data) {
      yield put(postAction.updatePostSuccess(props.payload));
    }
  } catch (error: any) {
    yield put(postAction.updatePostError(error.message));
  }
}

function* handelDeletePost(props: PayloadAction<string>) {
  try {
    const data: IPost<IAuthor> | null = yield call(fetchDeletePost, props.payload);
    if (data) {
      yield put(postAction.deletePostSuccess(props.payload));
    }
  } catch (error: any) {
    yield put(postAction.deletePostPending(error.message));
  }
}

export default function* postSaga() {
  yield takeLatest(postAction.getPostsPending.toString(), handelGetPost);
  yield takeLatest(postAction.createPostPending.toString(), handelCreatePost);
  yield takeLatest(postAction.updatePostPending.toString(), handelUpdatePost);
  yield takeLatest(postAction.deletePostPending.toString(), handelDeletePost);
}
