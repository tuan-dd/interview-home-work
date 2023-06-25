/* eslint-disable @typescript-eslint/no-explicit-any */
import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { IUpdateMe, IUser } from '@/utils/interface';
import { userAction } from '../user/user.slice';
import { fetchGetMe, fetchUpdateMe } from '@/api/user.api';
import { authAction } from '../auth/auth.slice';

function* handelUpdateMe(props: PayloadAction<IUpdateMe>) {
  try {
    const data: IUpdateMe | null = yield call(fetchUpdateMe, props.payload);
    if (data) {
      yield put(userAction.updateMeSuccess(props.payload));
    }
  } catch (error: any) {
    yield put(userAction.updateMeError(error.message));
  }
}

function* handelGetMe() {
  try {
    const data: IUser | null = yield call(fetchGetMe);
    if (data) {
      yield put(authAction.setAuth(data.email));
      yield put(userAction.getMeSuccess(data));
    }
  } catch (error: any) {
    yield put(userAction.getMeError(error.message));
  }
}

export default function* userSaga() {
  yield takeLatest(userAction.getMePending.toString(), handelGetMe);
  yield takeLatest(userAction.updateMePending.toString(), handelUpdateMe);
}
