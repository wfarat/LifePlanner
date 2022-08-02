import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const getDay = createAsyncThunk('getDay', async (data) => {
  const res = await axios(`/api/days/${data.userId}/${data.dayRef}`, {
    method: 'GET',
    headers: { 'x-access-token': data.accessToken },
  });
  return res.data;
});

const daySlice = createSlice({
  name: 'day',
  initialState: {
    data: {},
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
      });
  },
});

export const selectDay = (state) => state.day.data;
export const selectStatus = (state) => state.day.status;
export default daySlice.reducer;
