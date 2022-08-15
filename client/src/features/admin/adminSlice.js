import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const getAdminUsers = createAsyncThunk('getAdminUsers', async (data) => {
  const res = await axios(`/api/users`, {
    method: 'GET',
    headers: { 'x-access-token': data.accessToken },
  });
  return res.data;
});

export const deleteAdminUser = createAsyncThunk('deleteAdminUser', async (data) => {
  const res = await axios(`/api/users/admin/${data.userId}`, {
    method: 'DELETE',
    headers: { 'x-access-token': data.accessToken },
  });
  return res.data;
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    data: { adminUsers: [], message: '' },
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAdminUsers.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(getAdminUsers.fulfilled, (state, { payload }) => {
        state.status = 'idle';
        state.data.adminUsers = payload.users;
        state.data.message = '';
      })
      .addCase(getAdminUsers.rejected, (state) => {
        state.status = 'rejected';
        state.data = {redirect: true}
      })
      .addCase(deleteAdminUser.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(deleteAdminUser.fulfilled, (state, { payload }) => {
        state.status = 'idle';
        const index = state.data.adminUsers.findIndex(
          (user) => user.id === payload.userId
        );
        state.data.users.splice(index, 1);
        state.data.message = '';
      })
      .addCase(deleteAdminUser.rejected, (state) => {
        state.status = 'rejected';
        state.data.message = 'There was a problem with removing a user.';
      });
  },
});

export const selectAdmin = (state) => state.admin.data;
export const selectStatus = (state) => state.admin.status;
export default adminSlice.reducer;
