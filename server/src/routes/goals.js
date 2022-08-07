import express from 'express';
import { checkAuth } from './auth';

import {
  addGoal,
  addGoalTask,
  deleteGoal,
  findAllGoals,
  findGoal,
  findGoalTasks,
  sendGoals,
  sendGoalTasks,
} from '../controllers/goals';

const goalsRouter = express.Router();
goalsRouter.use(checkAuth);

goalsRouter.param('goalId', findGoal);

goalsRouter.get('/', findAllGoals, sendGoals);
goalsRouter.get('/:goalId', findGoalTasks, sendGoalTasks);
goalsRouter.post('/', addGoal);
goalsRouter.post('/:goalId', addGoalTask);
goalsRouter.delete('/:goalId', deleteGoal);
export default goalsRouter;
