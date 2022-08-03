import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const getTask = createAsyncThunk('getTask', async (data) => {
  const res = await axios(`/api/tasks/${data.userId}}`, {
    method: 'GET',
    headers: { 'x-access-token': data.accessToken },
  });
  return res.data;
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    data: {},
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTask.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(getTask.fulfilled, (state, { payload }) => {
        state.status = 'idle';
        state.data = payload;
      });
  },
});

export const selectTask = (state) => state.task.data;
export const selectStatus = (state) => state.task.status;
export default tasksSlice.reducer;
