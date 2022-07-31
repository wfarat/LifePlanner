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
export const getUser = async (data) => {
  const res = await axios(`/api/users/${data.userId}`, {
    method: 'GET',
    headers: { 'x-access-token': data.accessToken },
  });
  return res.data;
};
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
      });
  },
});

export const selectUser = (state) => state.user.data;
export const selectStatus = (state) => state.user.status;
export default userSlice.reducer;
export const { loginGoogle, addCart } = userSlice.actions;
