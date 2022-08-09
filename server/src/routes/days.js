import express from 'express';
import { checkAuth } from './auth';
import { sendDay, addDay, updateDayTask } from '../controllers/days';

const daysRouter = express.Router();
daysRouter.use(checkAuth);

daysRouter.get('/:dayRef', sendDay);
daysRouter.post('/:dayRef', addDay);
daysRouter.post('/task/update', updateDayTask);
export default daysRouter;
