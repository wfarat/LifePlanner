import logger from 'morgan';
import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth';
import usersRouter from './routes/users';
import daysRouter from './routes/days';

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/days', daysRouter);
app.use(express.static(path.resolve(__dirname, '../../client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../client/build', 'index.html'));
});
export default app;
