import express from 'express';
import { checkAuth } from './auth';

import {
  addGoal,
  addGoalTask,
  deleteGoal,
  findAllGoals,
  findGoal,
  findGoalTask,
  findGoalTasks,
  removeGoalTask,
  sendGoals,
  sendGoalTasks,
  updateGoal,
} from '../controllers/goals';

const goalsRouter = express.Router();
goalsRouter.use(checkAuth);

goalsRouter.param('goalId', findGoal);
goalsRouter.param('goalTaskId', findGoalTask);

goalsRouter.get('/', findAllGoals, sendGoals);
goalsRouter.get('/:goalId', findGoalTasks, sendGoalTasks);
goalsRouter.post('/', addGoal);
goalsRouter.post('/:goalId', addGoalTask);
goalsRouter.delete('/:goalId', deleteGoal);
goalsRouter.delete('/task/:goalTaskId', removeGoalTask);
goalsRouter.put('/:goalId', updateGoal);
export default goalsRouter;
