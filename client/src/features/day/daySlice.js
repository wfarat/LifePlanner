import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const getDay = createAsyncThunk('getDay', async (data) => {
  const res = await axios(`/api/days/${data.dayRef}`, {
    method: 'GET',
    headers: { 'x-access-token': data.accessToken },
  }).catch((err) => err.response);
  return res.data;
});
export const addDay = createAsyncThunk('addDay', async (data) => {
  const res = await axios(`/api/days/${data.dayRef}`, {
    method: 'POST',
    headers: { 'x-access-token': data.accessToken },
    data: data.day,
  });
  return res.data;
});

const daySlice = createSlice({
  name: 'day',
  initialState: {
    data: { day: {}, dayNotes: [], dayTasks: [], message: '' },
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDay.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(getDay.fulfilled, (state, { payload }) => {
        state.status = 'idle';
        state.data = payload;
      })
      .addCase(getDay.rejected, (state) => {
        state.status = 'rejected';
        state.data = { day: {}, dayNotes: [], dayTasks: [], message: '' };
      })
      .addCase(addDay.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(addDay.fulfilled, (state) => {
        state.status = 'idle';
      })
      .addCase(addDay.rejected, (state) => {
        state.status = 'rejected';
        state.data.message = 'There was a problem with adding day data.';
      });
  },
});

export const selectDay = (state) => state.day.data;
export const selectStatus = (state) => state.day.status;
export default daySlice.reducer;
