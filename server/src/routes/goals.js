import express from 'express';
import { checkAuth } from './auth';
import { findUser } from '../controllers/users';
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

goalsRouter.param('userId', findUser);
goalsRouter.param('goalId', findGoal);

goalsRouter.get('/:userId', findAllGoals, sendGoals);
goalsRouter.get('/:userId/:goalId', findGoalTasks, sendGoalTasks);
goalsRouter.post('/:userId', addGoal);
goalsRouter.post('/:userId/:goalId', addGoalTask);
goalsRouter.delete('/:userId/:goalId', deleteGoal);
export default goalsRouter;
