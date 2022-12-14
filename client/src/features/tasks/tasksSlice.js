import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const getTasks = createAsyncThunk('getTasks', async (data) => {
  const res = await axios(`/api/tasks`, {
    method: 'GET',
    headers: { 'x-access-token': data.accessToken },
  }).catch((err) => err.response);

  return res.data;
});

export const addTask = createAsyncThunk('addTask', async (data) => {
  const res = await axios(`/api/tasks`, {
    method: 'POST',
    headers: { 'x-access-token': data.accessToken },
    data: data.task,
  });
  return res.data;
});
export const deleteTask = createAsyncThunk('deleteTask', async (data) => {
  const res = await axios(`/api/tasks/${data.taskId}`, {
    method: 'DELETE',
    headers: { 'x-access-token': data.accessToken },
  });
  return res.data;
});
export const updateTask = createAsyncThunk('updateTask', async (data) => {
  const res = await axios(`/api/tasks/${data.taskId}`, {
    method: 'PUT',
    headers: { 'x-access-token': data.accessToken },
    data: data.task,
  });
  return res.data;
});
export const getAllTasksStats = createAsyncThunk(
  'getAllTasksStats',
  async (data) => {
    const res = await axios('/api/tasks/stats', {
      method: 'GET',
      headers: { 'x-access-token': data.accessToken },
    });
    return res.data;
  }
);
export const getStatsByDayRef = createAsyncThunk(
  'getStatsByDayRef',
  async (data) => {
    const res = await axios('/api/tasks/stats', {
      method: 'POST',
      headers: { 'x-access-token': data.accessToken },
      data: data.days,
    });
    return res.data;
  }
);
const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    data: {
      tasks: [],
      taskStats: [],
      allStats: {
        nostatus: [],
        total: [],
        warning: [],
        success: [],
        danger: [],
      },
      message: '',
    },
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
        state.data.message = '';
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
        state.data.message = '';
      })
      .addCase(addTask.rejected, (state) => {
        state.status = 'rejected';
        state.data.message = 'There was a problem with adding a task.';
      })
      .addCase(deleteTask.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(deleteTask.fulfilled, (state, { payload }) => {
        state.status = 'idle';
        const index = state.data.tasks.findIndex(
          (task) => task.id === payload.taskId
        );
        state.data.tasks.splice(index, 1);
        state.data.message = '';
      })
      .addCase(deleteTask.rejected, (state) => {
        state.status = 'rejected';
        state.data.message = 'There was a problem with removing a task.';
      })
      .addCase(updateTask.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(updateTask.fulfilled, (state, { payload }) => {
        state.status = 'idle';
        state.data.message = '';
        state.data.tasks = state.data.tasks.map((task) => {
          if (task.id === payload.task.id) {
            return payload.task;
          } else {
            return task;
          }
        });
      })
      .addCase(updateTask.rejected, (state) => {
        state.status = 'rejected';
        state.data.message = 'There was a problem with updating a task.';
      })
      .addCase(getAllTasksStats.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(getAllTasksStats.fulfilled, (state, { payload }) => {
        state.status = 'idle';
        state.data.allStats = payload.allStats;
        state.data.message = '';
      })
      .addCase(getAllTasksStats.rejected, (state) => {
        state.status = 'rejected';
        state.data.message = 'There was a problem with loading all tasks stats';
      })
      .addCase(getStatsByDayRef.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(getStatsByDayRef.fulfilled, (state, { payload }) => {
        state.status = 'idle';
        state.data.allStats = payload.allStats;
        state.data.message = '';
      })
      .addCase(getStatsByDayRef.rejected, (state) => {
        state.status = 'rejected';
        state.data.message = 'There was a problem with loading all tasks stats';
      });
  },
});

export const selectTasks = (state) => state.tasks.data;
export const selectTasksStatus = (state) => state.tasks.status;
export default tasksSlice.reducer;
