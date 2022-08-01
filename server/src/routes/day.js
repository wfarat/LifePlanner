import express from 'express';
import { checkAuth } from './auth';

const dayRouter = express.Router();
dayRouter.use(checkAuth);

export default dayRouter;
