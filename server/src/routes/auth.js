import express from 'express';

const authRouter = express.Router();

authRouter.get('/', (req, res) => res.status(200).json({ message: 'Welcome to Express API template' }));

export default authRouter;
