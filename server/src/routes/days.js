import express from 'express';
import { checkAuth } from './auth';
import {
  sendDay, addDay, findDay, updateDay
} from '../controllers/days';
import {
  addDayTask,
  deleteDayTask,
  sendDayTasks,
  updateDayTask,
  findDayTask,
} from '../controllers/dayTasks';
import {
  addDayNote,
  deleteDayNote,
  findDayNote,
  sendDayNotes,
  updateDayNote,
} from '../controllers/dayNotes';

const daysRouter = express.Router();
daysRouter.use(checkAuth);
daysRouter.param('dayRef', findDay);
daysRouter.param('noteId', findDayNote);
daysRouter.param('taskId', findDayTask);

daysRouter.get('/:dayRef', sendDay);
daysRouter.post('/', addDay);
daysRouter.put('/', updateDay);

daysRouter.get('/:dayRef/tasks', sendDayTasks);
daysRouter.post('/:dayRef/tasks', addDayTask);
daysRouter.put('/tasks/:taskId', updateDayTask);
daysRouter.delete('/tasks/:taskId', deleteDayTask);

daysRouter.get('/:dayRef/notes', sendDayNotes);
daysRouter.post('/:dayRef/notes', addDayNote);
daysRouter.put('/notes/:noteId', updateDayNote);
daysRouter.delete('/notes/:noteId', deleteDayNote);
export default daysRouter;
