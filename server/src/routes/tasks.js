import express from 'express';
import { checkAuth } from './auth';
import { findUser } from '../controllers/users';
import { findAllTasks, sendTasks } from '../controllers/tasks';

const tasksRouter = express.Router();
tasksRouter.use(checkAuth);

tasksRouter.param('userId', findUser);

tasksRouter.get('/:userId', findAllTasks, sendTasks);

export default tasksRouter;
