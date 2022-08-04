import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const getGoals = createAsyncThunk('getGoals', async (data) => {
  const res = await axios(`/api/goals/${data.userId}}`, {
    method: 'GET',
    headers: { 'x-access-token': data.accessToken },
  });
  return res.data;
});

export const addGoal = createAsyncThunk('addGoal', async (data) => {
    const res = await axios(`/api/goals/${data.userId}`, {
      method: 'POST',
      headers: { 'x-access-token': data.accessToken },
      data: data.goal
    });
    return res.data;
  })
const goalsSlice = createSlice({
  name: 'goals',
  initialState: {
    data: { goals: [], message: ''},
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
      })
      .addCase(addGoal.rejected, (state) => {
        state.status = 'rejected';
        state.data.message = 'There was a problem with adding a goal.';
      });
  },
});

export const selectGoals = (state) => state.goals.data;
export const selectStatus = (state) => state.goals.status;
export default goalsSlice.reducer;
