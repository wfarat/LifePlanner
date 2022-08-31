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
export const removeGoalTask = createAsyncThunk(
  'removeGoalTask',
  async (data) => {
    const res = await axios(`/api/goals/task/${data.goalTaskId}`, {
      method: 'DELETE',
      headers: { 'x-access-token': data.accessToken },
    });
    return res.data;
  }
);
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
  return res.data;
});
export const deleteGoal = createAsyncThunk('deleteGoal', async (data) => {
  const res = await axios(`/api/goals/${data.goalId}`, {
    method: 'DELETE',
    headers: { 'x-access-token': data.accessToken },
  });
  return res.data;
});
export const updateGoal = createAsyncThunk('updateGoal', async (data) => {
  const res = await axios(`/api/goals/${data.goalId}`, {
    method: 'PUT',
    headers: { 'x-access-token': data.accessToken },
    data: data.goal,
  });
  return res.data;
});
export const editGoalTask = createAsyncThunk('editGoalTask', async (data) => {
  const res = await axios(`/api/goals/task/${data.goalTaskId}`, {
    method: 'PUT',
    headers: { 'x-access-token': data.accessToken },
    data: data.goalTask,
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
      })
      .addCase(updateGoal.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(updateGoal.fulfilled, (state, { payload }) => {
        state.status = 'idle';
        state.data.message = '';
        state.data.goals = state.data.goals.map((goal) => {
          if (goal.id === payload.goal.id) {
            return payload.goal;
          } else {
            return goal;
          }
        });
      })
      .addCase(updateGoal.rejected, (state) => {
        state.status = 'rejected';
        state.data.message = 'There was a problem with updating a goal.';
      })
      .addCase(removeGoalTask.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(removeGoalTask.fulfilled, (state, { payload }) => {
        state.status = 'idle';
        const index = state.data.goalTasks.findIndex(
          (task) => task.id === payload.goalTaskId
        );
        state.data.goalTasks.splice(index, 1);
        state.data.message = '';
      })
      .addCase(removeGoalTask.rejected, (state) => {
        state.status = 'rejected';
        state.data.message = 'There was a problem with removing a goal.';
      })
      .addCase(editGoalTask.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(editGoalTask.fulfilled, (state, { payload }) => {
        state.status = 'idle';
        state.data.message = '';
        state.data.goalTasks = state.data.goalTasks.map((task) => {
          if (task.id === payload.goalTask.id) {
            return payload.goalTask;
          } else {
            return task;
          }
        });
      })
      .addCase(editGoalTask.rejected, (state) => {
        state.status = 'rejected';
        state.data.message = 'There was a problem with updating a goal.';
      });
  },
});

export const selectGoals = (state) => state.goals.data;
export const selectStatus = (state) => state.goals.status;
export default goalsSlice.reducer;
