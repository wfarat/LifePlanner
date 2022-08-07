import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const getNotes = createAsyncThunk('getNotes', async (data) => {
  const res = await axios(`/api/notes`, {
    method: 'GET',
    headers: { 'x-access-token': data.accessToken },
  });
  return res.data;
});

export const addNote = createAsyncThunk('addNote', async (data) => {
  const res = await axios(`/api/notes`, {
    method: 'POST',
    headers: { 'x-access-token': data.accessToken },
    data: data.note,
  });
  return res.data;
});
const notesSlice = createSlice({
  name: 'notes',
  initialState: {
    data: { notes: [], message: '' },
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getNotes.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(getNotes.fulfilled, (state, { payload }) => {
        state.status = 'idle';
        state.data.notes = payload.notes;
        state.data.message = '';
      })
      .addCase(getNotes.rejected, (state) => {
        state.status = 'rejected';
        state.data.message = 'There was a problem with loading notes.';
      })
      .addCase(addNote.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(addNote.fulfilled, (state, { payload }) => {
        state.status = 'idle';
        if (payload.note) {
          state.data.notes.push(payload.note);
        }
        state.data.message = '';
      })
      .addCase(addNote.rejected, (state) => {
        state.status = 'rejected';
        state.data.message = 'There was a problem with adding a note.';
      });
  },
});

export const selectNotes = (state) => state.notes.data;
export const selectStatus = (state) => state.notes.status;
export default notesSlice.reducer;
