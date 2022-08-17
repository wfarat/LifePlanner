import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const findDay = createAsyncThunk('findDay', async (data) => {
  const res = await axios(`/api/days/${data.dayRef}`, {
    method: 'GET',
    headers: { 'x-access-token': data.accessToken },
  });
  return res.data;
});
export const updateDay = createAsyncThunk('updateDay', async (data) => {
  const res = await axios(`/api/days/`, {
    method: 'PUT',
    headers: { 'x-access-token': data.accessToken },
    data: data.day,
  });
  return res.data;
});
const daySlice = createSlice({
  name: 'day',
  initialState: {
    data: { day: {}, message: '' },
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(findDay.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(findDay.fulfilled, (state, { payload }) => {
        state.status = 'idle';
        state.data.day = payload.day;
      })
      .addCase(findDay.rejected, (state) => {
        state.status = 'rejected';
        state.data.day = {};
      })
      .addCase(updateDay.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(updateDay.fulfilled, (state, { payload }) => {
        state.status = 'idle';
        state.data.day = payload.day;
      })
      .addCase(updateDay.rejected, (state) => {
        state.status = 'rejected';
        state.data.message = 'There was a problem with updating day data.';
      });
  },
});

export const selectDay = (state) => state.day.data;
export const selectStatus = (state) => state.day.status;
export default daySlice.reducer;
