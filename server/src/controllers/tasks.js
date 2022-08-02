import Model from '../models/model';

const tasksModel = new Model('tasks');

const findByUser = async (userId) => {
    const data = await tasksModel.select('*', ` WHERE user_id = ${userId}`);
    return data.rows;
}

export const findAllTasks = async (req, res, next) => {
    const tasks = await findByUser(req.user.id);
    if (!tasks) {
      res.status(404).send({
        message: `User id ${req.user.id} has no tasks created`,
      });
    } else {
      req.tasks = tasks;
      next();
    }
}

export const sendTasks = async (req, res) => {
    res.status(200).send({tasks: req.tasks});
}