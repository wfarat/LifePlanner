import express from 'express';
import { checkAuth } from './auth';
import { findUser } from '../controllers/users';
import { addTask, deleteTask, findAllTasks, findTask, sendTasks } from '../controllers/tasks';

const tasksRouter = express.Router();
tasksRouter.use(checkAuth);

tasksRouter.param('userId', findUser);
tasksRouter.param('taskId', findTask);

tasksRouter.get('/:userId', findAllTasks, sendTasks);
tasksRouter.post('/:userId', addTask);
tasksRouter.delete('/:userId/:taskId', deleteTask);
export default tasksRouter;
