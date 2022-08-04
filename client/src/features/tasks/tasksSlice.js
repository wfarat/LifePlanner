import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const getTasks = createAsyncThunk('getTasks', async (data) => {
  const res = await axios(`/api/tasks/${data.userId}}`, {
    method: 'GET',
    headers: { 'x-access-token': data.accessToken },
  });
  return res.data;
});

export const addTask = createAsyncThunk('addTask', async (data) => {
  const res = await axios(`/api/tasks/${data.userId}`, {
    method: 'POST',
    headers: { 'x-access-token': data.accessToken },
    data: data.task
  });
  return res.data;
})

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    data: { tasks: [], message: ''},
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTasks.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(getTasks.fulfilled, (state, { payload }) => {
        state.status = 'idle';
        state.data.tasks = payload.tasks;
      })
      .addCase(getTasks.rejected, (state) => {
        state.status = 'rejected';
        state.data.message = 'There was a problem with loading tasks';
      })
      .addCase(addTask.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(addTask.fulfilled, (state, { payload }) => {
        state.status = 'idle';
        if (payload.task) {
          state.data.tasks.push(payload.task);
        }
      })
      .addCase(addTask.rejected, (state) => {
        state.status = 'rejected';
        state.data.message = 'There was a problem with adding a task.';
      });
  },
});

export const selectTasks = (state) => state.tasks.data;
export const selectStatus = (state) => state.tasks.status;
export default tasksSlice.reducer;
