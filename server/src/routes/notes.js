import express from 'express';
import { checkAuth } from './auth';
import { findUser } from '../controllers/users';
import { addNote, findAllNotes, sendNotes } from '../controllers/notes';

const notesRouter = express.Router();
notesRouter.use(checkAuth);

notesRouter.param('userId', findUser);

notesRouter.get('/:userId', findAllNotes, sendNotes);
notesRouter.post('/:userId', addNote);
export default notesRouter;
