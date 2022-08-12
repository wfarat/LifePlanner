import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const getDayNotes = createAsyncThunk('getDayNotes', async (data) => {
  const res = await axios(`/api/days/${data.dayRef}/notes`, {
    method: 'GET',
    headers: { 'x-access-token': data.accessToken },
  });
  return res.data;
});
export const addDayNote = createAsyncThunk('addDayNote', async (data) => {
  const res = await axios(`/api/days/${data.dayRef}/notes`, {
    method: 'POST',
    headers: { 'x-access-token': data.accessToken },
    data: data.dayNote,
  });
  return res.data;
});
export const updateDayNote = createAsyncThunk(
  'updateDayNotes',
  async (data) => {
    const res = await axios(`/api/days/notes/${data.dayNoteId}`, {
      method: 'PUT',
      headers: { 'x-access-token': data.accessToken },
      data: data.dayNote,
    });
    return res.data;
  }
);
export const deleteDayNote = createAsyncThunk('deleteDayNote', async (data) => {
  const res = await axios(`/api/days/notes/${data.dayNoteId}`, {
    method: 'DELETE',
    headers: { 'x-access-token': data.accessToken },
  });
  return res.data;
});
const dayNotesSlice = createSlice({
  name: 'dayNotes',
  initialState: {
    data: { dayNotes: [], message: '' },
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDayNotes.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(getDayNotes.fulfilled, (state, { payload }) => {
        state.status = 'idle';
        state.data = payload;
      })
      .addCase(getDayNotes.rejected, (state) => {
        state.status = 'rejected';
      })
      .addCase(addDayNote.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(addDayNote.fulfilled, (state, {payload}) => {
        state.status = 'idle';
        state.data.dayNotes.push(payload.dayNote);
      })
      .addCase(addDayNote.rejected, (state) => {
        state.status = 'rejected';
        state.data.message = 'There was a problem with adding day notes data.';
      })
      .addCase(updateDayNote.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(updateDayNote.fulfilled, (state, { payload }) => {
        state.status = 'idle';
        state.data.dayNotes = state.data.dayNotes.map((note) => {
          if (note.id === payload.dayNote.id) {
            return payload.dayNote;
          } else {
            return note;
          }
        });
      })
      .addCase(updateDayNote.rejected, (state) => {
        state.status = 'rejected';
        state.data.message = 'There was a problem with updating day note data.';
      })
      .addCase(deleteDayNote.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(deleteDayNote.fulfilled, (state, { payload }) => {
        state.status = 'idle';
        const index = state.data.dayNotes.findIndex(
          (dayNote) => dayNote.id === payload.id
        );
        state.data.dayNotes.splice(index, 1);
        state.data.message = '';
      })
      .addCase(deleteDayNote.rejected, (state) => {
        state.status = 'rejected';
        state.data.message = 'There was a problem with removing a day note.';
      });
  },
});

export const selectDayNotes = (state) => state.dayNotes.data;
export const selectStatus = (state) => state.dayNotes.status;
export default dayNotesSlice.reducer;
