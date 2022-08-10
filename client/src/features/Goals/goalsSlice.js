import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const getGoals = createAsyncThunk('getGoals', async (data) => {
  const res = await axios(`/api/goals`, {
    method: 'GET',
    headers: { 'x-access-token': data.accessToken },
  });
  return res.data;
});
export const getGoalTasks = createAsyncThunk('getGoalTasks', async (data) => {
  const res = await axios(`/api/goals/${data.goalId}`, {
    method: 'GET',
    headers: { 'x-access-token': data.accessToken },
  });
  return res.data;
});
export const addGoal = createAsyncThunk('addGoal', async (data) => {
  const res = await axios(`/api/goals`, {
    method: 'POST',
    headers: { 'x-access-token': data.accessToken },
    data: data.goal,
  });
  return res.data;
});
export const addGoalTask = createAsyncThunk('addGoalTask', async (data) => {
  const res = await axios(`/api/goals/${data.goalId}`, {
    method: 'POST',
    headers: { 'x-access-token': data.accessToken },
    data: data.goalTask,
  });
  console.log(res.data)
  return res.data;
});
export const deleteGoal = createAsyncThunk('deleteGoal', async (data) => {
  const res = await axios(`/api/goals/${data.goalId}`, {
    method: 'DELETE',
    headers: { 'x-access-token': data.accessToken },
  });
  return res.data;
});
const goalsSlice = createSlice({
  name: 'goals',
  initialState: {
    data: { goals: [], goalTasks: [], message: '' },
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getGoals.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(getGoals.fulfilled, (state, { payload }) => {
        state.status = 'idle';
        state.data.goals = payload.goals;
        state.data.message = '';
      })
      .addCase(getGoals.rejected, (state) => {
        state.status = 'rejected';
        state.data.message = 'There was a problem with loading goals.';
      })
      .addCase(addGoal.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(addGoal.fulfilled, (state, { payload }) => {
        state.status = 'idle';
        if (payload.goal) {
          state.data.goals.push(payload.goal);
        }
        state.data.message = '';
      })
      .addCase(addGoal.rejected, (state) => {
        state.status = 'rejected';
        state.data.message = 'There was a problem with adding a goal.';
      })
      .addCase(getGoalTasks.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(getGoalTasks.fulfilled, (state, { payload }) => {
        state.status = 'idle';
        state.data.goalTasks = payload.goalTasks;
        state.data.message = '';
      })
      .addCase(getGoalTasks.rejected, (state) => {
        state.status = 'rejected';
        state.data.message = 'There was a problem with loading goal tasks';
      })
      .addCase(addGoalTask.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(addGoalTask.fulfilled, (state, { payload }) => {
        state.status = 'idle';
        if (payload.goalTask) {
          state.data.goalTasks.push(payload.goalTask);
        }
        state.data.message = '';
      })
      .addCase(addGoalTask.rejected, (state) => {
        state.status = 'rejected';
        state.data.message = 'There was a problem with adding a goal task.';
      })
      .addCase(deleteGoal.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(deleteGoal.fulfilled, (state, { payload }) => {
        state.status = 'idle';
        const index = state.data.goals.findIndex(
          (goal) => goal.id === payload.goalId
        );
        state.data.goals.splice(index, 1);
        state.data.message = '';
      })
      .addCase(deleteGoal.rejected, (state) => {
        state.status = 'rejected';
        state.data.message = 'There was a problem with removing a goal.';
      });
  },
});

export const selectGoals = (state) => state.goals.data;
export const selectStatus = (state) => state.goals.status;
export default goalsSlice.reducer;
