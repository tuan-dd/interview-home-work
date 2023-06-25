/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { call, fork, put, take, takeEvery } from 'redux-saga/effects';

import { PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { ILogin, IResponseLogin, authAction } from '../auth/auth.slice';
import {
  fetchNewAccessToken,
  fetchSignIn,
  fetchSignOut,
  fetchSignUp,
} from '@/api/auth.api';
import { ISignUp } from '@/utils/interface';
import { decoded, setAllCookie, setHeaders, setKeyHeader } from '@/utils/jwt';
import { EKeyHeader } from '@/utils/enum';
import { userAction } from '../user/user.slice';

/**
 * @param fork non-blocking
 */

function* handleSignIn(action: PayloadAction<ILogin>) {
  try {
    const data: IResponseLogin | null = yield call(fetchSignIn, action.payload);

    if (data) {
      setAllCookie(false, {
        userId: data.user._id,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      setKeyHeader(data.accessToken, EKeyHeader.ACCESS_TOKEN);
      setKeyHeader(data.user._id, EKeyHeader.USER_ID);

      yield put(userAction.setUser(data.user));
      yield put(authAction.signInSuccess(data.user.email));
    }
  } catch (error: any) {
    yield put(authAction.signInError(error.message));
  }
}

function* handleSignOut() {
  try {
    yield call(fetchSignOut);
    setHeaders(true); // remove all token in header
    setAllCookie(true); // remove all token in cookie
    yield put(authAction.signOutSuccess());
    yield put(userAction.restart());
  } catch (error: any) {
    yield put(authAction.signOutError(error.message));
  }
}

function* handleSignUp(action: PayloadAction<ISignUp>) {
  try {
    const user: IResponseLogin | null = yield call(fetchSignUp, action.payload);

    if (user) yield put(authAction.signUpSuccess());
  } catch (error: any) {
    yield put(authAction.signUpError(error.message));
  }
}

function* handleNewAccessToken(action: PayloadAction<string>) {
  try {
    setHeaders();
    const newAccessToken: string | null = yield call(fetchNewAccessToken);

    if (newAccessToken) {
      setKeyHeader(newAccessToken, EKeyHeader.ACCESS_TOKEN);

      Cookies.set('accessToken', newAccessToken, {
        httpOnly: false,
        secure: false,
        path: '/',
        sameSite: 'strict',
      });
      yield put(authAction.newAccessTokenSuccess(action.payload));
      yield put(userAction.getMePending());
    }
  } catch (error: any) {
    yield put(authAction.signUpError(error.message));
  }
}

function* watchSignInFlow() {
  while (true) {
    const accessToken = decoded(Cookies.get('accessToken'));
    if (!accessToken) {
      const action: PayloadAction<ILogin> = yield take(authAction.signInPending.type);
      yield fork(handleSignIn, action);
    }
    yield take(authAction.signOutPending.type);
    yield call(handleSignOut);
  }
}

export default function* authSaga() {
  yield fork(watchSignInFlow);
  yield takeEvery(authAction.signUpPending.toString(), handleSignUp);
  yield takeEvery(authAction.newAccessTokenPending.toString(), handleNewAccessToken);
}
