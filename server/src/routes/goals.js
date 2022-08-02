import express from 'express';
import { checkAuth } from './auth';
import { findUser } from '../controllers/users';
import { findAllGoals, sendGoals } from '../controllers/goals';

const goalsRouter = express.Router();
goalsRouter.use(checkAuth);

goalsRouter.param('userId', findUser);

goalsRouter.get('/:userId', findAllGoals, sendGoals);

export default goalsRouter;
