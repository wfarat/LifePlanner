import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const getDayTasks = createAsyncThunk('getDayTasks', async (data) => {
  const res = await axios(`/api/days/${data.dayRef}/tasks`, {
    method: 'GET',
    headers: { 'x-access-token': data.accessToken },
  });
  return res.data;
});
export const addDayTask = createAsyncThunk('addDayTasks', async (data) => {
  const res = await axios(`/api/days/${data.dayRef}/tasks`, {
    method: 'POST',
    headers: { 'x-access-token': data.accessToken },
    data: data.dayTask,
  });
  return res.data;
});
export const updateDayTask = createAsyncThunk(
  'updateDayTasks',
  async (data) => {
    const res = await axios(`/api/days/tasks/${data.dayTaskId}`, {
      method: 'PUT',
      headers: { 'x-access-token': data.accessToken },
      data: data.dayTask,
    });
    return res.data;
  }
);
export const deleteDayTask = createAsyncThunk('deleteDayTask', async (data) => {
  const res = await axios(`/api/days/tasks/${data.dayTaskId}`, {
    method: 'DELETE',
    headers: { 'x-access-token': data.accessToken },
  });
  return res.data;
});
const dayTasksSlice = createSlice({
  name: 'dayTasks',
  initialState: {
    data: { dayTasks: [], message: '' },
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDayTasks.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(getDayTasks.fulfilled, (state, { payload }) => {
        state.status = 'idle';
        state.data.dayTasks = payload.dayTasks;
      })
      .addCase(getDayTasks.rejected, (state) => {
        state.status = 'rejected';
      })
      .addCase(addDayTask.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(addDayTask.fulfilled, (state, {payload}) => {
        state.status = 'idle';
        state.data.dayTasks.push(payload.dayTask);
      })
      .addCase(addDayTask.rejected, (state) => {
        state.status = 'rejected';
        state.data.message = 'There was a problem with adding day tasks data.';
      })
      .addCase(updateDayTask.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(updateDayTask.fulfilled, (state, { payload }) => {
        state.status = 'idle';
        state.data.dayTasks = state.data.dayTasks.map((task) => {
          if (task.id === payload.dayTask.id) {
            return payload.dayTask;
          } else {
            return task;
          }
        });
      })
      .addCase(updateDayTask.rejected, (state) => {
        state.status = 'rejected';
        state.data.message = 'There was a problem with updating day task data.';
      })
      .addCase(deleteDayTask.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(deleteDayTask.fulfilled, (state, { payload }) => {
        state.status = 'idle';
        const index = state.data.dayTasks.findIndex(
          (dayTask) => dayTask.id === payload.id
        );
        state.data.dayTasks.splice(index, 1);
        state.data.message = '';
      })
      .addCase(deleteDayTask.rejected, (state) => {
        state.status = 'rejected';
        state.data.message = 'There was a problem with removing a day task.';
      });
  },
});

export const selectDayTasks = (state) => state.dayTasks.data;
export const selectStatus = (state) => state.dayTasks.status;
export default dayTasksSlice.reducer;
