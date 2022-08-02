import express from 'express';
import { checkAuth } from './auth';
import { findUser } from '../controllers/users';
import { sendDay } from '../controllers/days';

const daysRouter = express.Router();
daysRouter.use(checkAuth);

daysRouter.param('userId', findUser);

daysRouter.get('/:userId/:dayRef', sendDay);

export default daysRouter;
