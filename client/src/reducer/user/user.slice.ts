/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUpdateMe, IUser } from '@/utils/interface';
import { AppDispatch, RootState } from '@/app/store';
import { EStatusRedux } from '@/utils/enum';
import { createToast } from '@/utils/utils';

/**
 * @getUser
 * @getHotel
 * @UpdateUser
 * @updateHotel
 */

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState;
  dispatch: AppDispatch;
  rejectValue: string;
}>();

interface IUserRedux {
  status: EStatusRedux;
  currentUser: IUser | null;
  errorMessage: string;
}

const initialState: IUserRedux = {
  status: EStatusRedux.idle,
  currentUser: null,
  errorMessage: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.status = EStatusRedux.succeeded;
      state.currentUser = action.payload;
      state.errorMessage = '';
    },
    restart: (state) => {
      state.status = EStatusRedux.succeeded;
      state.currentUser = null;
      state.errorMessage = '';
    },

    getMePending: (state) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    },
    updateMePending: (state, _action: PayloadAction<IUpdateMe>) => {
      state.status = EStatusRedux.pending;
      state.errorMessage = '';
    },

    getMeSuccess: (state, action: PayloadAction<IUser>) => {
      state.status = EStatusRedux.succeeded;
      state.currentUser = action.payload;
      state.errorMessage = '';
    },
    updateMeSuccess: (state, action: PayloadAction<IUpdateMe>) => {
      state.status = EStatusRedux.pending;
      const { name, avatar } = action.payload;
      if (state.currentUser) state.currentUser = { ...state.currentUser, name, avatar };
      createToast('Update success', 'info');
      state.errorMessage = '';
    },

    getMeError: (state, action: PayloadAction<string>) => {
      state.status = EStatusRedux.error;
      state.errorMessage = action.payload || 'some thing wrong';
    },
    updateMeError: (state, action: PayloadAction<string>) => {
      state.status = EStatusRedux.error;
      state.errorMessage = action.payload || 'some thing wrong';
    },
  },
});

export const userAction = userSlice.actions;

export default userSlice.reducer;

