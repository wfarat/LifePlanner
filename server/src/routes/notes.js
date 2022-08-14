import express from 'express';
import { checkAuth } from './auth';
import {
  addNote,
  findAllNotes,
  sendNotes,
  findNote,
  deleteNote,
  updateNote,
} from '../controllers/notes';

const notesRouter = express.Router();
notesRouter.use(checkAuth);
notesRouter.param('noteId', findNote);

notesRouter.get('/', findAllNotes, sendNotes);
notesRouter.post('/', addNote);
notesRouter.delete('/:noteId', deleteNote);
notesRouter.put('/:noteId', updateNote);
export default notesRouter;
