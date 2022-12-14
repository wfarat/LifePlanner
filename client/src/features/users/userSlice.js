import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const login = createAsyncThunk(`login`, async (data) => {
  const res = await axios(`/api/login`, {
    method: 'POST',
    data: data,
  });
  return res.data;
});
export const update = createAsyncThunk('update', async (data) => {
  const res = await axios(`/api/users/${data.userId}`, {
    method: 'PUT',
    headers: { 'x-access-token': data.accessToken },
    data: data.info,
  });
  return res.data;
});
export const getUser = createAsyncThunk('getUser', async (data) => {
  const res = await axios(`/api/users/${data.userId}`, {
    method: 'GET',
    headers: { 'x-access-token': data.accessToken },
  });
  return res.data;
});
export const updateLanguage = createAsyncThunk(
  'updateLanguage',
  async (data) => {
    const res = await axios(`/api/users/${data.userId}/lang`, {
      method: 'PUT',
      headers: { 'x-access-token': data.accessToken },
      data: data.lang,
    });
    return res.data;
  }
);
export const registerUser = async (data) => {
  const res = await axios('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: data,
  });
  const { user } = res.data;
  return user;
};

const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: {
      auth: false,
      accessToken: '',
      message: '',
      user: {
        id: '',
        firstname: '',
        lang: '',
        lastname: '',
        email: '',
      },
    },
    status: 'idle',
  },
  reducers: {
    loginGoogle(state, { payload }) {
      state.data = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.status = 'idle';
        state.data = payload;
      })
      .addCase(login.rejected, (state) => {
        state.status = 'rejected';
        state.data.message = 'Invalid username and/or password.';
      })
      .addCase(update.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(update.fulfilled, (state, { payload }) => {
        state.status = 'idle';
        state.data.user = payload.user;
        state.data.message = '';
      })
      .addCase(update.rejected, (state) => {
        state.status = 'rejected';
        state.data.message = 'Please enter correct password';
      })
      .addCase(getUser.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(getUser.fulfilled, (state, { payload }) => {
        state.status = 'idle';
        state.data.user = payload.user;
        state.data.message = '';
      })
      .addCase(getUser.rejected, (state) => {
        state.status = 'rejected';
        state.data = {
          auth: false,
          accessToken: '',
          message: '',
          user: {
            id: '',
            lang: '',
            firstname: '',
            lastname: '',
            email: '',
          },
        };
      })
      .addCase(updateLanguage.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(updateLanguage.fulfilled, (state, { payload }) => {
        state.status = 'idle';
        state.data.user.lang = payload.lang;
        state.data.message = '';
      })
      .addCase(updateLanguage.rejected, (state) => {
        state.status = 'rejected';
        state.data.message = 'Please choose different language';
      });
  },
});

export const selectUser = (state) => state.user.data;
export const selectStatus = (state) => state.user.status;
export default userSlice.reducer;
export const { loginGoogle, addCart } = userSlice.actions;
