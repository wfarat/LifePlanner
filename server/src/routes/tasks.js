import express from 'express';
import { checkAuth } from './auth';
import {
  addTask,
  deleteTask,
  findAllTasks,
  findTask,
  sendTasks,
  updateTask,
  getTaskStats,
  getAllTasksStats
} from '../controllers/tasks';

const tasksRouter = express.Router();
tasksRouter.use(checkAuth);

tasksRouter.param('taskId', findTask);

tasksRouter.get('/', findAllTasks, sendTasks);
tasksRouter.post('/', addTask);
tasksRouter.delete('/:taskId', deleteTask);
tasksRouter.put('/:taskId', updateTask);
tasksRouter.get('/stats', getAllTasksStats);
export default tasksRouter;
