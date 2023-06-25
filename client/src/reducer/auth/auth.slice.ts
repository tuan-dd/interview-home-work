/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ISignUp, IUser } from '@utils/interface';

import { EStatusRedux } from '@utils/enum';
import { AppDispatch, RootState } from '@app/store';
import { createToast } from '@/utils/utils';

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState;
  dispatch: AppDispatch;
  rejectValue: string;
}>();

export interface IAuth {
  status: EStatusRedux;
  isSignIn: boolean;
  email: string;
  errorMessage: string;
}

export interface ILogin {
  email: string;
  password: string;
}

const initialState: IAuth = {
  status: EStatusRedux.idle,
  isSignIn: false,
  email: '',
  errorMessage: '',
};

export interface IResponseLogin {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<string>) => {
      state.isSignIn = true;
      state.email = action.payload;
      state.errorMessage = '';
    },
    signInPending: (state, _action: PayloadAction<ILogin>) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    },
    signUpPending: (state, _action: PayloadAction<ISignUp>) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    },
    newAccessTokenPending: (state, _action: PayloadAction<string>) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    },
    signOutPending: (state) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    },

    signInSuccess: (state, action: PayloadAction<string>) => {
      state.status = EStatusRedux.succeeded;
      state.email = action.payload;
      state.isSignIn = true;
    },
    newAccessTokenSuccess: (state, action: PayloadAction<string>) => {
      state.status = EStatusRedux.succeeded;
      state.email = action.payload;
      state.isSignIn = true;
    },
    signUpSuccess: (state) => {
      createToast('create user success', 'success');
      state.status = EStatusRedux.succeeded;
    },
    signOutSuccess: (state) => {
      state.status = EStatusRedux.succeeded;
      state.errorMessage = '';
      state.isSignIn = false;
      state.email = '';
    },

    signInError: (state, action: PayloadAction<string>) => {
      state.status = EStatusRedux.error;
      state.errorMessage = action.payload || 'Some thing wrong';
    },
    signUpError: (state, action: PayloadAction<string>) => {
      state.status = EStatusRedux.error;
      state.errorMessage = action.payload || 'Some thing wrong';
    },
    newAccessTokenError: (state, action: PayloadAction<string>) => {
      state.status = EStatusRedux.error;
      state.errorMessage = action.payload || 'Some thing wrong';
    },
    signOutError: (state, action: PayloadAction<string>) => {
      state.status = EStatusRedux.error;
      state.errorMessage = action.payload || 'Some thing wrong';
    },
  },
});

export const authAction = authSlice.actions;

export default authSlice.reducer;

