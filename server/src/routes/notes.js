import express from 'express';
import { checkAuth } from './auth';
import { addNote, findAllNotes, sendNotes } from '../controllers/notes';

const notesRouter = express.Router();
notesRouter.use(checkAuth);


notesRouter.get('/', findAllNotes, sendNotes);
notesRouter.post('/', addNote);
export default notesRouter;
